import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function Activate() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('كلمات المرور غير متطابقة');
            return;
        }

        if (password.length < 6) {
            setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
            return;
        }

        setIsLoading(true);
        try {
            await api.post('/api/activate', { token, password });
            setSuccess(true);
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (err) {
            console.error('Activation error:', err);
            setError(err.response?.data?.message || 'فشل تفعيل الحساب. قد يكون الرابط منتهي الصلاحية.');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-100 rounded-full blur-3xl opacity-50"></div>
                </div>
                <div className="max-w-md w-full glass-card p-12 text-center relative z-10">
                    <div className="w-24 h-24 bg-green-500 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-200 animate-bounce">
                        <i className="fas fa-check text-4xl"></i>
                    </div>
                    <h2 className="text-3xl font-black text-gray-800 mb-4">تم التفعيل بنجاح!</h2>
                    <p className="text-gray-500 font-bold">مرحباً بك في المنصة. سيتم توجيهك لتسجيل الدخول الآن...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen premium-gradient flex items-center justify-center p-6 relative overflow-hidden" dir="rtl">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[35%] h-[35%] bg-black/10 rounded-full blur-3xl animate-pulse delay-700"></div>
            </div>

            <div className="w-full max-w-md bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl p-8 md:p-12 relative z-10 border border-white/20">
                <div className="text-center mb-10">
                    <div className="w-24 h-24 bg-dark-green rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-6 shadow-xl">
                        <img src="/assets/mod_white.svg" alt="Logo" className="w-14 h-14 object-contain" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-800 mb-2">تفعيل الحساب</h1>
                    <p className="text-gray-500 font-bold">يرجى تعيين كلمة مرور قوية للبدء</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-r-4 border-red-500 text-red-700 rounded-2xl flex items-center gap-3 animate-shake">
                        <i className="fas fa-exclamation-circle text-lg"></i>
                        <p className="text-sm font-black text-right pr-2">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 mr-2">كلمة المرور الجديدة</label>
                        <div className="relative group">
                            <i className="fas fa-lock absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-dark-green transition-colors"></i>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pr-12 pl-4 py-4 bg-gray-50 border-2 border-transparent focus:border-dark-green focus:bg-white rounded-2xl outline-none transition-all duration-300 font-bold text-gray-800 placeholder:text-gray-300 text-right"
                                placeholder="••••••••"
                                dir="rtl"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 mr-2">تأكيد كلمة المرور</label>
                        <div className="relative group">
                            <i className="fas fa-shield-alt absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-dark-green transition-colors"></i>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pr-12 pl-4 py-4 bg-gray-50 border-2 border-transparent focus:border-dark-green focus:bg-white rounded-2xl outline-none transition-all duration-300 font-bold text-gray-800 placeholder:text-gray-300 text-right"
                                placeholder="••••••••"
                                dir="rtl"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-5 premium-gradient text-white font-black text-lg rounded-[1.5rem] hover:shadow-2xl hover:shadow-green-900/40 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                    >
                        {isLoading ? (
                            <i className="fas fa-circle-notch fa-spin"></i>
                        ) : (
                            <>
                                <span>تفعيل الحساب والبدء</span>
                                <i className="fas fa-check group-hover:scale-125 transition-transform duration-300"></i>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

