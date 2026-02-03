import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import api from '../api/client';
import { validateSaudiPhone } from '../utils/phoneValidation';

export default function UpdateEmp() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    Name: '',
    Email: '',
    Mobile: '',
    Job: '',
    Role: '',
    Blocked: false,
    Balance: 60,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/api/users/${id}`);
        setForm(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: checked });
    } else if (name === 'Mobile') {
      const validatedPhone = validateSaudiPhone(value);
      if (validatedPhone !== null) {
        setForm({ ...form, Mobile: validatedPhone });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/users/${id}`, form);
      alert('تم تحديث بيانات الموظف بنجاح!');
      navigate('/dashboard/users');
    } catch (err) {
      alert('حدث خطأ أثناء التحديث: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-dark-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-12 text-center space-y-6 max-w-2xl mx-auto mt-20">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center text-3xl mx-auto">
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        <h2 className="text-2xl font-black text-gray-800">حدث خطأ أثناء تحميل البيانات</h2>
        <p className="text-gray-400 font-bold">{error}</p>
        <button onClick={() => navigate(-1)} className="px-8 py-3 bg-dark-green text-white rounded-2xl font-black">العودة للخلف</button>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate(-1)}
            className="w-14 h-14 glass-card flex items-center justify-center text-gray-600 hover:bg-dark-green hover:text-white transition-all duration-300 group"
          >
            <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1 text-blue-600">
              <div className="w-1.5 h-6 bg-current rounded-full"></div>
              <h1 className="text-3xl font-black tracking-tight text-gray-800 uppercase">تعديل الملف الشخصي</h1>
            </div>
            <p className="text-gray-500 font-bold pr-4">تحديث بيانات الموظف والصلاحيات المرتبطة به في المنصة</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <div className="glass-card p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-blue-500/60"></div>

            <form className="space-y-10" onSubmit={handleSubmit}>
              {/* Basic Info Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-sm">
                    <i className="fas fa-id-card-alt"></i>
                  </div>
                  <h2 className="text-xl font-black text-gray-800">المعلومات الأساسية</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">الاسم الكامل</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                        <i className="fas fa-user-tag"></i>
                      </div>
                      <input
                        type="text"
                        name="Name"
                        value={form.Name}
                        onChange={handleChange}
                        required
                        className="w-full pr-12 pl-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-blue-500/30 focus:bg-white outline-none font-bold text-gray-800 transition-all placeholder:text-gray-300"
                        placeholder="اسم الموظف"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">رقم الجوال</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                        <i className="fas fa-phone"></i>
                      </div>
                      <input
                        type="text"
                        name="Mobile"
                        dir="ltr"
                        value={form.Mobile}
                        onChange={handleChange}
                        required
                        className="w-full pr-12 pl-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-blue-500/30 focus:bg-white outline-none font-bold text-gray-800 transition-all text-right"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">البريد الإلكتروني</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <input
                      type="email"
                      name="Email"
                      value={form.Email}
                      onChange={handleChange}
                      required
                      className="w-full pr-12 pl-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-blue-500/30 focus:bg-white outline-none font-bold text-gray-800 transition-all placeholder:text-gray-300"
                    />
                  </div>
                </div>
              </div>

              {/* Role & Job Section */}
              <div className="space-y-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center text-sm">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <h2 className="text-xl font-black text-gray-800">الصلاحيات والتخصص</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">التخصص الوظيفي</label>
                    <select
                      name="Job"
                      value={form.Job}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-blue-500/30 focus:bg-white outline-none font-black text-gray-800 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">اختر التخصص</option>
                      <option value="photo">مصور فوتوغرافي</option>
                      <option value="video">مصور فيديو</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">المستوى الإداري</label>
                    <select
                      name="Role"
                      value={form.Role}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-blue-500/30 focus:bg-white outline-none font-black text-gray-800 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">اختر الصلاحية</option>
                      <option value="admin">مدير نظام</option>
                      <option value="user">عضو فريق</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Blocked Status */}
              <div className={`p-6 rounded-3xl border-2 transition-all duration-500 flex items-center gap-4 cursor-pointer select-none ${form.Blocked ? 'bg-red-50 border-red-100 text-red-700' : 'bg-slate-50 border-transparent text-slate-500'
                }`} onClick={() => setForm({ ...form, Blocked: !form.Blocked })}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all ${form.Blocked ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'bg-white text-slate-300'
                  }`}>
                  <i className={`fas ${form.Blocked ? 'fa-user-slash' : 'fa-check-circle'}`}></i>
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-sm">حالة العضوية الحالية</h4>
                  <p className="text-[10px] font-bold opacity-70">تعطيل العضوية يمنع الوصول الفوري للمنصة</p>
                </div>
                <div className={`w-12 h-6 rounded-full relative transition-colors ${form.Blocked ? 'bg-red-500' : 'bg-slate-200'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${form.Blocked ? 'left-1' : 'left-7'}`}></div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-6">
                <button
                  type="submit"
                  className="flex-1 py-5 premium-gradient text-white rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-green-900/40 transition-all active:scale-[0.98]"
                >
                  <i className="fas fa-save text-xl"></i>
                  <span>حفظ التغييرات الجديدة</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-10 py-5 bg-slate-100 text-slate-500 rounded-[2rem] font-black hover:bg-slate-200 transition-all"
                >
                  إلغاء التعديل
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-10 flex flex-col items-center text-center space-y-6">
            <div className="w-24 h-24 rounded-[2.5rem] bg-slate-50 border-4 border-white shadow-xl flex items-center justify-center text-3xl font-black text-blue-500">
              {form.Name?.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-800">{form.Name}</h3>
              <p className="text-xs font-black text-blue-500 uppercase tracking-widest mt-1">ID: #{id}</p>
            </div>

            <div className="w-full space-y-3 pt-6 border-t border-gray-50">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-gray-400 uppercase tracking-tighter">الحالة الحالية</span>
                <span className={`px-2 py-1 rounded-lg ${form.Blocked ? 'bg-rose-50 text-rose-500' : 'bg-green-50 text-green-500'}`}>
                  {form.Blocked ? 'محظور' : 'نشط'}
                </span>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 bg-slate-900 text-white relative overflow-hidden group border-none">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-[60px]"></div>
            <div className="relative z-10 space-y-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-blue-400">
                <i className="fas fa-info-circle"></i>
              </div>
              <h3 className="text-lg font-black">أمن البيانات</h3>
              <p className="text-xs font-bold text-gray-400 leading-relaxed opacity-70">أي تغيير في البريد الإلكتروني أو رقم الجوال قد يؤثر على طريقة دخول العضو للنظام وتلقي التنبيهات.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
