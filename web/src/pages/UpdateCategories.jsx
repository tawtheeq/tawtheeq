import { useState } from 'react';

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
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">إضافة تصنيف جديد</h1>
                    <p className="text-gray-500 mt-1">أدخل تفاصيل التصنيف الجديد</p>
                </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-8">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            {/* <label className="text-sm font-medium text-gray-700">اسم التصنيف</label> */}
                            <input
                                type="text"
                                name="CategoryName"
                                value={form.CategoryName}
                                onChange={handleChange}
                                required
                                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                                placeholder="أدخل اسم التصنيف"
                            />
                        </div>
                        <div className="space-y-2">
                            {/* <label className="text-sm font-medium text-gray-700">نوع التصنيف</label> */}
                            <select
                                name="CategoryType"
                                value={form.CategoryType}
                                onChange={handleChange}
                                required
                                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                            >
                                <option value="">اختر نوع التصنيف</option>
                                <option value="main">تصنيف رئيسي</option>
                                <option value="sub">تصنيف فرعي</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            {/* <label className="text-sm font-medium text-gray-700">الوصف</label> */}
                            <input
                                type="text"
                                name="Description"
                                value={form.Description}
                                onChange={handleChange}
                                required
                                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                                placeholder="أدخل وصف التصنيف"
                            />
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
