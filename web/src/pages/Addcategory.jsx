import { useState } from 'react';
import '../styles/pages/missions.scss';
import { use } from 'react';
import { useActionData } from 'react-router-dom';
import axios from 'axios';

export default function Addcategory() {


    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        CategoryName: '',
        CategoryType: '',
        Description: '',

    });





    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("/api/categories", {
                ...form
            });

            console.log("Server response:", response.data);
            alert("Data submitted successfully!");
        } catch (error) {
            console.error("Error submitting data:", error);
            alert(error);
            // alert("Error occurred while submitting data!",error);
        }


        setForm({
            name: '',
            mobile: '',
            email: '',
        });
    };

    return (
        <div className="users-container">
            <div className="users-header">
                <h1>إضافة تصنيف جديد</h1>
            </div>
            <form className="input-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label>اسم التصنيف</label>
                        <input
                            type="text"
                            name="CategoryName"
                            value={form.CategoryName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label> نوع التصنيف</label>
                        <select
                            type="text"
                            name="CategoryType"
                            value={form.CategoryType}
                            onChange={handleChange}
                            required>
                            <option value="">اختر نوع التصنيف</option>
                            <option value="main">تصنيف رئيسي</option>
                            <option value="sub">تصنيف فرعي</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>الوصف</label>
                        <input
                            type="text"
                            name="Description"
                            value={form.Description}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="function-button">
                    <i className="fas fa-plus"></i> إضافة
                </button>
            </form>
        </div>
    );
}
