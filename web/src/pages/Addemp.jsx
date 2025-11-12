import { useState } from 'react';
import '../styles/pages/missions.scss';

export default function AddEmp() {


  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
  });


  const taskStart = '2025-09-13';
  const taskEnd = '2025-09-20';


   const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

  const handleSubmit = (e) => {
    e.preventDefault();



    setForm({
      name: '',
      mobile: '',
      email: '',
     
    });
    // setSelectedPhotographers({
    //   p1: '',
    //   p2: '',
    //   p3: '',
    //   p4: '',
    //   p5: '',
    // });
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
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>رقم الجوال</label>
            <input
              type="text"
              name="mobile"
              value={form.mobile}
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
              name="email"
              value={form.email}
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
