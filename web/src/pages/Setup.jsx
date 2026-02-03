import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function Setup() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (form.password !== form.confirmPassword) {
            setError('كلمات المرور غير متطابقة');
            return;
        }

        setLoading(true);
        try {
            await api.post('/api/setup/register', {
                name: form.name,
                email: form.email,
                mobile: form.mobile,
                password: form.password
            });
            alert('تم إعداد النظام بنجاح! يمكنك الآن تسجيل الدخول.');
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'فشل إعداد النظام');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-green via-medium-green to-light-green flex items-center justify-center p-6 relative overflow-hidden" dir="rtl">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-black/10 rounded-full blur-3xl animate-pulse delay-700"></div>
            </div>

            <div className="w-full max-w-xl bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-8 md:p-12 relative z-10 border border-white/20">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-dark-green rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3 hover:rotate-0 transition-transform duration-500 shadow-lg">
                        <i className="fas fa-tools text-3xl text-white"></i>
                    </div>
                    <h1 className="text-3xl font-black text-gray-800 mb-2">إعداد النظام</h1>
                    <p className="text-gray-500">مرحباً بك في منصة توثيق. يرجى إعداد حساب المدير الأول للنظام.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-r-4 border-red-500 text-red-700 rounded-xl flex items-center gap-3 animate-shake">
                        <i className="fas fa-exclamation-circle"></i>
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 mr-2">الاسم الكامل</label>
                            <div className="relative">
                                <i className="fas fa-user absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full pr-12 pl-4 py-4 bg-gray-50 border-2 border-transparent focus:border-dark-green focus:bg-white rounded-2xl outline-none transition-all duration-300 font-medium text-gray-800 placeholder:text-gray-400"
                                    placeholder="أدخل اسمك الكامل"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 mr-2">رقم الجوال</label>
                            <div className="relative">
                                <i className="fas fa-mobile-alt absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                <input
                                    type="text"
                                    name="mobile"
                                    required
                                    value={form.mobile}
                                    onChange={handleChange}
                                    className="w-full pr-12 pl-4 py-4 bg-gray-50 border-2 border-transparent focus:border-dark-green focus:bg-white rounded-2xl outline-none transition-all duration-300 font-medium text-gray-800 placeholder:text-gray-400"
                                    placeholder="05xxxxxxxx"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 mr-2">البريد الإلكتروني</label>
                        <div className="relative">
                            <i className="fas fa-envelope absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="email"
                                name="email"
                                required
                                value={form.email}
                                onChange={handleChange}
                                className="w-full pr-12 pl-4 py-4 bg-gray-50 border-2 border-transparent focus:border-dark-green focus:bg-white rounded-2xl outline-none transition-all duration-300 font-medium text-gray-800 placeholder:text-gray-400"
                                placeholder="name@company.com"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 mr-2">كلمة المرور</label>
                            <div className="relative">
                                <i className="fas fa-lock absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={form.password}
                                    onChange={handleChange}
                                    className="w-full pr-12 pl-4 py-4 bg-gray-50 border-2 border-transparent focus:border-dark-green focus:bg-white rounded-2xl outline-none transition-all duration-300 font-medium text-gray-800 placeholder:text-gray-400"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 mr-2">تأكيد كلمة المرور</label>
                            <div className="relative">
                                <i className="fas fa-shield-alt absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full pr-12 pl-4 py-4 bg-gray-50 border-2 border-transparent focus:border-dark-green focus:bg-white rounded-2xl outline-none transition-all duration-300 font-medium text-gray-800 placeholder:text-gray-400"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-dark-green text-white font-black text-lg rounded-[1.5rem] hover:bg-medium-green hover:shadow-2xl hover:shadow-green-900/40 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? (
                            <i className="fas fa-circle-notch fa-spin"></i>
                        ) : (
                            <>
                                <span>حفظ وإعداد النظام</span>
                                <i className="fas fa-check group-hover:translate-x-[-4px] transition-transform duration-300"></i>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
