import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddEmp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    Name: '',
    Email: '',
    Mobile: '',
    Job: '',
    Role: '',
  });


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
              <input
                type="text"
                name="Name"
                value={form.Name}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                placeholder="أدخل اسم الموظف"
              />
            </div>
            <div className="space-y-2">
              <input
                type="text"
                name="Mobile"
                value={form.Mobile}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                placeholder="أدخل رقم الجوال"
              />
            </div>
            <div className="space-y-2">
              <input
                type="email"
                name="Email"
                value={form.Email}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                placeholder="أدخل البريد الإلكتروني"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">

            <div className="space-y-2">
              <select
                name="Job"
                value={form.Job}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
              >
                <option value="">اختر الوظيفة</option>
                <option value="photo">مصور فوتوغرافي</option>
                <option value="video">مصور فيديو</option>
              </select>
            </div>

            <div className="space-y-2">
              <select
                name="Role"
                value={form.Role}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
              >
                <option value="">اختر الصلاحية</option>
                <option value="admin">مدير</option>
                <option value="user">مستخدم</option>
              </select>
            </div>
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
