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
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-check text-2xl"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">تم تفعيل الحساب بنجاح!</h2>
                    <p className="text-gray-600">سيتم توجيهك إلى صفحة تسجيل الدخول خلال لحظات...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-800 to-green-900 px-4">
            <div className="max-w-md w-full bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl">
                <div className="text-center mb-8">
                    <img src="/assets/logo.png" alt="Logo" className="w-20 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800">تفعيل الحساب</h2>
                    <p className="text-gray-500 mt-2">يرجى تعيين كلمة مرور جديدة لحسابك</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm text-right">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1 text-right">
                        <label className="text-sm font-medium text-gray-700">كلمة المرور الجديدة</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-700 focus:outline-none text-right"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="space-y-1 text-right">
                        <label className="text-sm font-medium text-gray-700">تأكيد كلمة المرور</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-700 focus:outline-none text-right"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-green-800 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-lg active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                جاري التفعيل...
                            </>
                        ) : (
                            'تفعيل الحساب'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
