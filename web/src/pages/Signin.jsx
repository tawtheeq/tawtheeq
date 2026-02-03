import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen premium-gradient flex items-center justify-center p-6 relative overflow-hidden" dir="rtl">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[35%] h-[35%] bg-black/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="w-full max-w-md bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl p-8 md:p-12 relative z-10 border border-white/20">
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-dark-green rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-6 hover:rotate-0 transition-all duration-500 shadow-xl group">
            <img src="/assets/mod_white.svg" alt="Logo" className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-500" />
          </div>
          <h1 className="text-3xl font-black text-gray-800 mb-2">منصة توثيق</h1>
          <p className="text-gray-500 font-bold">إدارة العمليات الإعلامية والمهام</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-r-4 border-red-500 text-red-700 rounded-2xl flex items-center gap-3 animate-shake">
            <i className="fas fa-exclamation-circle text-lg"></i>
            <p className="text-sm font-black">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 mr-2">البريد الإلكتروني</label>
            <div className="relative group">
              <i className="fas fa-envelope absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-dark-green transition-colors"></i>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pr-12 pl-4 py-4 bg-gray-50 border-2 border-transparent focus:border-dark-green focus:bg-white rounded-2xl outline-none transition-all duration-300 font-bold text-gray-800 placeholder:text-gray-300 text-right"
                placeholder="name@company.com"
                dir="rtl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 mr-2">كلمة المرور</label>
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

          <div className="flex justify-between items-center px-2 py-1">
            <button type="button" className="text-sm font-bold text-dark-green hover:underline">نسيت كلمة المرور؟</button>
            <label className="flex items-center gap-2 cursor-pointer group">
              <span className="text-sm font-bold text-gray-600 group-hover:text-gray-800 transition-colors">تذكرني</span>
              <input type="checkbox" className="w-4 h-4 rounded-md border-gray-300 text-dark-green focus:ring-dark-green" />
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-5 premium-gradient text-white font-black text-lg rounded-[1.5rem] hover:shadow-2xl hover:shadow-green-900/40 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <i className="fas fa-circle-notch fa-spin"></i>
            ) : (
              <>
                <span>تسجيل الدخول</span>
                <i className="fas fa-arrow-left group-hover:translate-x-[-4px] transition-transform duration-300"></i>
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-500 text-sm font-bold">ليس لديك حساب؟ <a href="#" className="text-dark-green hover:underline">تواصل مع الإدارة</a></p>
        </div>
      </div>
    </div>
  );
}

