import { useState } from 'react';
import '../styles/pages/missions.scss';
import axios from 'axios';

export default function AddEmp() {


  const [form, setForm] = useState({
    Name: '',
    Email: '',
    Mobile: '',
  });




  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/users", { ...form });
      console.log("Server response:", response.data);
      alert("Data submitted successfully!");
    } catch (error) {
      console.error("Error submitting data:", error);
      alert(error);
    }

    setForm({
      Name: '',
      Email: '',
      Mobile: '',ß

    });
  };



  return (
    <div className="users-container">
      <div className="users-header">
        <h1>إضافة مهمة جديدة</h1>
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
          <i className="fas fa-plus"></i> إضافة
        </button>
      </form>
    </div>
  );
}
