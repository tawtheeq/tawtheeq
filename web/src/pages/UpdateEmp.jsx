import { useState } from 'react';
import { useParams } from "react-router-dom";
import { useEffect } from 'react';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    setForm({ ...form, [e.target.name]: e.target.value });
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
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">تحديث بيانات الموظف</h1>
          <p className="text-gray-500 mt-1">تعديل معلومات الموظف</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
          onClick={() => navigate(-1)}
        >
          <i className="fas fa-arrow-right"></i>
          <span>عودة</span>
        </button>
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
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">البريد الإلكتروني</label>
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
