import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
      const response = await axios.post("/api/users", form);
      console.log("Server response:", response.data);
      alert("تم إضافة الموظف بنجاح!");
      console.log("Data submitted successfully!", form);

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

      // Navigate back to users page
      navigate('/dashboard/users');
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("حدث خطأ أثناء إضافة الموظف: " + (error.response?.data?.message || error.message));
    }
  };



  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard/users')}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <i className="fas fa-arrow-right"></i>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">إضافة موظف جديد</h1>
            <p className="text-sm text-gray-500 mt-1">أدخل تفاصيل الموظف الجديد</p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">اسم الموظف</label>
              <input
                type="text"
                name="Name"
                value={form.Name}
                onChange={handleChange}
                required
                className="mt-2 w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                placeholder="أدخل اسم الموظف"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">رقم الجوال</label>
              <input
                type="text"
                name="Mobile"
                dir="ltr"
                value={form.Mobile}
                onChange={handleChange}
                required
                className="mt-2 w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                placeholder="+9665XXXXXXXX"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">البريد الإلكتروني</label>
              <input
                type="email"
                name="Email"
                value={form.Email}
                onChange={handleChange}
                required
                className="mt-2 w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                placeholder="أدخل البريد الإلكتروني"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">الوظيفة</label>
              <select
                name="Job"
                value={form.Job}
                onChange={handleChange}
                required
                className="mt-2 w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
              >
                <option value="">اختر الوظيفة</option>
                <option value="photo">مصور فوتوغرافي</option>
                <option value="video">مصور فيديو</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700"> رصيد المستخدم</label>
              <input
                type="number"
                name="Balance"
                value={form.Balance}
                onChange={handleChange}
                min="0"
                max="60"
                required
                className="mt-2 w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                placeholder="أدخل رصيد المستخدم (0-60)"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">الصلاحية</label>
              <select
                name="Role"
                value={form.Role}
                onChange={handleChange}
                required
                className="mt-2 w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
              >
                <option value="">اختر الصلاحية</option>
                <option value="admin">مدير</option>
                <option value="user">مستخدم</option>
              </select>
            </div>

          </div>

          {/* Blocked Checkbox */}
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
            <input
              type="checkbox"
              id="blocked"
              name="Blocked"
              checked={form.Blocked}
              onChange={handleChange}
              className="w-5 h-5 text-red-600 bg-white border-gray-300 rounded focus:ring-red-500 focus:ring-2 cursor-pointer"
            />
            <label htmlFor="blocked" className="text-sm font-medium text-red-700 cursor-pointer select-none">
              <i className="fas fa-ban ml-2"></i>
              حظر هذا الموظف من المشاركة في المهام
            </label>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard/users')}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-dark-green text-white rounded-xl hover:bg-light-green transition-colors flex items-center gap-2"
            >
              <i className="fas fa-plus"></i>
              إضافة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
