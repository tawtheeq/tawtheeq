import { useState } from 'react';
import { useParams } from "react-router-dom";
import { useEffect } from 'react';
import '../styles/pages/missions.scss';
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
    <div className="users-container">
      <div className="users-header">
        <h1>تحديث بيانات الموظف</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
       
          <button 
            className="function-button"
            onClick={() => navigate(-1)}
          >
            <i className="fas fa-arrow-right"></i>
            رجوع
          </button>
        </div>
      </div>
      <form className="input-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>الاسم</label>
            <input
              type="text"
              name="Name"
              value={form.Name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>رقم الجوال</label>
            <input
              type="text"
              name="Mobile"
              value={form.Mobile}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>البريد الإلكتروني</label>
            <input
              type="email"
              name="Email"
              value={form.Email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <br />

        <button type="submit" className="function-button">
          <i className="fas fa-save"></i> حفظ التغييرات
        </button>
      </form>
    </div>
  );
}
