import { useState } from 'react';

import axios from 'axios';

export default function AddEmp() {
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
      alert("Data submitted successfully!", response.data);
      console.log("Data submitted successfully!", form);
    } catch (error) {
      console.error("Error submitting data:", error);
      alert(error);
    }

    setForm({
      Name: '',
      Email: '',
      Mobile: '',
      Job: '',
      Role: '',
    });
  };



  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إضافة موظف جديد</h1>
          <p className="text-gray-500 mt-1">أدخل تفاصيل الموظف الجديد</p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              {/* <label className="text-sm font-medium text-gray-700">الاسم</label> */}
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
              {/* <label className="text-sm font-medium text-gray-700">رقم الجوال</label> */}
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
              {/* <label className="text-sm font-medium text-gray-700">البريد الإلكتروني</label> */}
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
              {/* <label className="text-sm font-medium text-gray-700">البريد الإلكتروني</label> */}
              <select
                name="Job"
                value={form.Job}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                placeholder="الوظيفة"
              >
                <option value="">اختر</option>
                <option value="photo">مصور فوتوغرافي</option>
                <option value="video">مصور فيديو</option>
              </select>
            </div>

            <div className="space-y-2">
              {/* <label className="text-sm font-medium text-gray-700">البريد الإلكتروني</label> */}
              <select
                name="Role"
                value={form.Role}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                placeholder="حدد الصلاحية"
              >
                <option value="">اختر</option>
                <option value="admin">مدير</option>
                <option value="user">مستخدم</option>
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 bg-green-800 text-white font-semibold rounded-xl hover:bg-green-900 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <i className="fas fa-plus"></i>
              <span>إضافة</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
