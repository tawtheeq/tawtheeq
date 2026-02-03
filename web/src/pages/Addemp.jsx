import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { validateSaudiPhone } from '../utils/phoneValidation';

export default function AddEmp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    Name: '',
    Email: '',
    Mobile: '',
    Job: '',
    Role: '',
    Blocked: false,
    Balance: 60,
  });


  const [invitationLink, setInvitationLink] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle checkbox inputs
    if (type === 'checkbox') {
      setForm({ ...form, [name]: checked });
      return;
    }

    // Handle Balance validation
    if (name === "Balance") {
      const balanceValue = parseInt(value);


      // تحويل الأرقام الهندية إلى عربية
      const arabicToLatin = {
        '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
        '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
      };

      let v = value.replace(/[٠-٩]/g, d => arabicToLatin[d]);

      // السماح فقط بالأرقام و +
      v = v.replace(/[^0-9+]/g, "");

      // منع القيم السالبة
      if (balanceValue < 0) {
        alert('الرصيد لا يمكن أن يكون سالبًا');
        return;
      }

      // منع القيم أكبر من 60
      if (balanceValue > 60) {
        alert('الرصيد لا يمكن أن يتجاوز 60 يومًا');
        return;
      }

      setForm({ ...form, Balance: balanceValue });
      return;
    }

    // أي حقل غير الجوال
    if (name !== "Mobile") {
      setForm({ ...form, [name]: value });
      return;
    }

    // استخدام دالة التحقق من الرقم السعودي
    const validatedPhone = validateSaudiPhone(value);

    // لو الرقم صالح، حدّث الحقل
    if (validatedPhone !== null) {
      setForm({ ...form, Mobile: validatedPhone });
    }
    // لو الرقم غير صالح، لا تحدث الحقل (تجاهل الإدخال)
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/api/users", form);
      const token = response.data.data.invitation_token;

      const link = `${window.location.origin}/activate/${token}`;
      setInvitationLink(link);
      setShowModal(true);

      // Reset form
      setForm({
        Name: '',
        Email: '',
        Mobile: '',
        Job: '',
        Role: '',
        Blocked: false,
        Balance: 60,
      });
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("حدث خطأ أثناء إضافة الموظف: " + (error.response?.data?.message || error.message));
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(invitationLink);
    alert("تم نسخ الرابط!");
  };



  return (
    <div className="space-y-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/dashboard/users')}
            className="w-14 h-14 glass-card flex items-center justify-center text-gray-600 hover:bg-dark-green hover:text-white transition-all duration-300 group"
          >
            <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1 text-dark-green">
              <div className="w-1.5 h-6 bg-current rounded-full"></div>
              <h1 className="text-3xl font-black tracking-tight text-gray-800">إضافة عضو جديد</h1>
            </div>
            <p className="text-gray-500 font-bold pr-4">تسجيل بيانات الموظف ومنحه صلاحيات الوصول للمنصة</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <div className="glass-card p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 premium-gradient opacity-60"></div>

            <form className="space-y-10" onSubmit={handleSubmit}>
              {/* Basic Info Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-dark-green/10 text-dark-green rounded-lg flex items-center justify-center text-sm">
                    <i className="fas fa-user-plus"></i>
                  </div>
                  <h2 className="text-xl font-black text-gray-800">المعلومات الشخصية</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">الاسم الكامل</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-dark-green transition-colors">
                        <i className="fas fa-id-card"></i>
                      </div>
                      <input
                        type="text"
                        name="Name"
                        value={form.Name}
                        onChange={handleChange}
                        required
                        className="w-full pr-12 pl-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-dark-green/30 focus:bg-white outline-none font-bold text-gray-800 transition-all placeholder:text-gray-300"
                        placeholder="اسم الموظف الثلاثي"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">رقم الجوال</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-dark-green transition-colors">
                        <i className="fas fa-phone"></i>
                      </div>
                      <input
                        type="text"
                        name="Mobile"
                        dir="ltr"
                        value={form.Mobile}
                        onChange={handleChange}
                        required
                        className="w-full pr-12 pl-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-dark-green/30 focus:bg-white outline-none font-bold text-gray-800 transition-all placeholder:text-gray-300 text-right"
                        placeholder="+966 5x xxx xxxx"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">البريد الإلكتروني</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-dark-green transition-colors">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <input
                      type="email"
                      name="Email"
                      value={form.Email}
                      onChange={handleChange}
                      required
                      className="w-full pr-12 pl-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-dark-green/30 focus:bg-white outline-none font-bold text-gray-800 transition-all placeholder:text-gray-300"
                      placeholder="example@company.com"
                    />
                  </div>
                </div>
              </div>

              {/* Role & Job Section */}
              <div className="space-y-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-sm">
                    <i className="fas fa-briefcase"></i>
                  </div>
                  <h2 className="text-xl font-black text-gray-800">التوصيف الوظيفي</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">التخصص</label>
                    <select
                      name="Job"
                      value={form.Job}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-dark-green/30 focus:bg-white outline-none font-black text-gray-800 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">اختر التخصص</option>
                      <option value="photo">مصور فوتوغرافي</option>
                      <option value="video">مصور فيديو</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">رصيد المهام (يوم)</label>
                    <input
                      type="number"
                      name="Balance"
                      value={form.Balance}
                      onChange={handleChange}
                      min="0"
                      max="60"
                      required
                      className="w-full px-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-dark-green/30 focus:bg-white outline-none font-black text-gray-800 transition-all"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">صلاحية النظام</label>
                    <select
                      name="Role"
                      value={form.Role}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-dark-green/30 focus:bg-white outline-none font-black text-gray-800 transition-all appearance-none cursor-pointer"
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
                  <h4 className="font-black text-sm">حالة العضوية الفورية</h4>
                  <p className="text-[10px] font-bold opacity-70">عند الحظر، لن يتمكن الموظف من تسجيل الدخول أو المشاركة في أي مهام جديدة</p>
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
                  <i className="fas fa-plus-circle text-xl"></i>
                  <span>إضافة الموظف للنظام</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/users')}
                  className="px-10 py-5 bg-slate-100 text-slate-500 rounded-[2rem] font-black hover:bg-slate-200 transition-all"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar Help */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-8 bg-dark-green text-white relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">
                <i className="fas fa-magic"></i>
              </div>
              <h3 className="text-xl font-black">نصائح التفعيل</h3>
              <ul className="space-y-3 text-sm font-bold opacity-90">
                <li className="flex gap-2">
                  <i className="fas fa-check-circle mt-1 opacity-60"></i>
                  <span>تأكد من صحة رقم الجوال لتلقي التنبيهات</span>
                </li>
                <li className="flex gap-2">
                  <i className="fas fa-check-circle mt-1 opacity-60"></i>
                  <span>الرصيد الافتراضي هو 60 يوماً للمهام</span>
                </li>
                <li className="flex gap-2">
                  <i className="fas fa-check-circle mt-1 opacity-60"></i>
                  <span>سيتم توليد رابط دعوة خاص بعد الإضافة</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="glass-card p-8 border-dashed border-2 border-slate-200 flex flex-col items-center justify-center text-center space-y-4 opacity-60">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
              <i className="fas fa-shield-alt"></i>
            </div>
            <div>
              <h4 className="font-black text-gray-400 text-sm">بيانات آمنة</h4>
              <p className="text-[10px] font-bold text-gray-400">جميع البيانات مشفرة وتخضع لسياسة الخصوصية</p>
            </div>
          </div>
        </div>
      </div>

      {/* Invitation Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-dark-green/20 backdrop-blur-xl flex items-center justify-center z-50 p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] shadow-2xl max-w-lg w-full p-10 text-center animate-in zoom-in-95 duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 premium-gradient"></div>

            <div className="w-24 h-24 bg-green-50 text-green-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-4xl shadow-inner border-2 border-white">
              <i className="fas fa-sparkles"></i>
            </div>

            <h2 className="text-3xl font-black text-gray-800 mb-4">تم تسجيل العضو بنجاح!</h2>
            <p className="text-gray-500 font-bold mb-10 leading-relaxed px-4">
              خطوة واحدة متبقية، انسخ رابط الدعوة أدناه وأرسله للعضو الجديد ليتمكن من تفعيل حسابه وتعيين كلمة السر الخاصة به.
            </p>

            <div className="bg-slate-50 rounded-3xl p-6 mb-10 border-2 border-slate-100 flex items-center gap-4 relative group">
              <span className="text-xs font-black text-gray-300 absolute -top-3 right-6 bg-white px-3 py-1 rounded-full border border-slate-100">رابط الدعوة الخاص</span>
              <input
                type="text"
                readOnly
                value={invitationLink}
                className="bg-transparent border-none outline-none text-sm text-gray-600 flex-1 font-mono font-bold"
              />
              <button
                onClick={copyToClipboard}
                className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center text-slate-600 hover:text-dark-green hover:border-dark-green/30 transition-all shadow-sm active:scale-95"
                title="نسخ الرابط"
              >
                <i className="fas fa-copy text-xl"></i>
              </button>
            </div>

            <button
              onClick={() => navigate('/dashboard/users')}
              className="w-full py-5 premium-gradient text-white rounded-[2rem] font-black text-lg shadow-xl shadow-green-900/20 hover:scale-[1.02] transition-all"
            >
              العودة لقائمة الأعضاء
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

