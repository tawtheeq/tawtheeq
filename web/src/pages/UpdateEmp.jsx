import { useState } from 'react';
import { useParams } from "react-router-dom";
import { useEffect } from 'react';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { validateSaudiPhone } from '../utils/phoneValidation';

export default function UpdateEmp() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    ID: Number(id) || 0,
    Name: '',
    Email: '',
    Mobile: '',
  });


  useEffect(() => {
    const fetchData = async () => {
      try {

        // alert("Fetching data for user ID: " + id);
        const user = await axios.get(`/api/users/${id}`);

        const userData = user.data.data;
        console.log("Fetched users data:", userData);
        // alert(JSON.stringify(userData));
        setForm({
          ID: Number(id) || 0,
          Name: userData.Name,
          Email: userData.Email,
          Mobile: userData.Mobile,
          Blocked: userData.Blocked,
        });

      } catch (err) {
        setError(err.message);
        console.log(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle checkbox inputs
    if (type === 'checkbox') {
      setForm({ ...form, [name]: checked });
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
    console.log("Payload to send:", form);

    try {
      const response = await axios.put(`/api/users/${id}`, form, {
        headers: { "Content-Type": "application/json" }
      });
      console.log("Server response:", response.data);
      alert("تم التحديث بنجاح!");
    } catch (error) {
      console.error("Error submitting data:", error);
      alert(error.response?.data?.message || error.message || "حدث خطأ أثناء حفظ البيانات!");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        {/* <div>
          <h1 className="text-2xl font-bold text-gray-800">تحديث بيانات الموظف</h1>
          <p className="text-gray-500 mt-1">تعديل معلومات الموظف</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
          onClick={() => navigate(-1)}
        >
          <i className="fas fa-arrow-right"></i>
          <span>عودة</span>
        </button> */}


        <div className="flex items-center gap-3">
          <button
            // onClick={() => navigate('/dashboard/users')}
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <i className="fas fa-arrow-right"></i>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800"> تحديث بيانات الموظف </h1>
            <p className="text-sm text-gray-500 mt-1">  تحديث معلومات الموظف </p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">الاسم</label>
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
                placeholder="أدخل رقم الجوال"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700"> الوظيفة</label>

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
              <label className="text-sm font-medium text-gray-700">الدور </label>

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
              checked={form.Blocked || false}
              onChange={handleChange}
              className="w-5 h-5 text-red-600 bg-white border-gray-300 rounded focus:ring-red-500 focus:ring-2 cursor-pointer"
            />
            <label htmlFor="blocked" className="text-sm font-medium text-red-700 cursor-pointer select-none">
              <i className="fas fa-ban ml-2"></i>
              حظر هذا الموظف من المشاركة في المهام
            </label>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 bg-green-800 text-white font-semibold rounded-xl hover:bg-green-900 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <i className="fas fa-save"></i>
              <span>حفظ التغييرات</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
