import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:bg-gray-900">
      <div className="relative p-8 w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 animate-fade-in">
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5">
          <img src="/assets/logo.png" alt="Logo" className="w-24 mb-2" />

          <h2 className="text-2xl font-bold text-green-800">إدارة العمليات الإعلامية</h2>

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
            className="w-full py-3 rounded-xl bg-green-800 text-white font-semibold hover:bg-green-900 transition-all shadow-md"
          >
            تسجيل الدخول
          </button>
        </form>
      </div>
    </div>
  );
}
