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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:bg-gray-900">
      <div className="relative p-8 w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 animate-fade-in">
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5">
          <img src="/assets/logo.png" alt="Logo" className="w-24 mb-2" />

          <h2 className="text-2xl font-bold text-green-800">إدارة العمليات الإعلامية</h2>

          {error && (
            <div className="w-full p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm text-right">
              {error}
            </div>
          )}

          <input
            type="email"
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            dir="rtl"
            required
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-700 focus:outline-none text-right"
          />

          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            dir="rtl"
            required
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-700 focus:outline-none text-right"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-green-800 text-white font-semibold hover:bg-green-900 transition-all shadow-md active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                جاري تسجيل الدخول...
              </>
            ) : (
              'تسجيل الدخول'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
