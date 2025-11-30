import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UpdateMission() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [mainCategories, setMainCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        MissionName: '',
        CoordinatorNum: '',
        MainCategory: '',
        SubCategory: '',
        Day: '',
        Month: '',
        Year: '',
        DurationDays: '',
        ID: Number(id) || 0,
    });

    const numericFields = ["CoordinatorNum", "MainCategory", "SubCategory", "Year", "Month", "Day", "DurationDays", "ID"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: numericFields.includes(name) ? (value ? Number(value) : 0) : value
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [mainRes, subRes, missionRes] = await Promise.all([
                    axios.get("/api/maincategories"),
                    axios.get("/api/subcategories"),
                    axios.get(`/api/missions/${id}`)
                ]);

                console.log("Fetched mission data:", missionRes.data.data);
                setMainCategories(mainRes.data.data || []);
                setSubCategories(subRes.data.data || []);


                const mission = missionRes.data.data;
                alert(JSON.stringify(mission));
                setForm({
                    MissionName: mission.MissionName,
                    CoordinatorNum: Number(mission.CoordinatorNum),
                    MainCategory: Number(mission.MainCategory),
                    SubCategory: Number(mission.SubCategory),
                    Day: Number(mission.Day),
                    Month: Number(mission.Month),
                    Year: Number(mission.Year),
                    DurationDays: Number(mission.DurationDays),
                    ID: Number(mission.ID),
                });

            } catch (err) {
                setError(err.message);
                alert(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Payload to send:", form);

        try {
            const response = await axios.put(`/api/missions/${form.ID}`, form, {
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
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">تعديل المهمة</h1>
                    <p className="text-gray-500 mt-1">تحديث معلومات المهمة</p>
                </div>
                <button
                    className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
                    onClick={() => navigate(-1)}
                >
                    <i className="fas fa-arrow-right"></i>
                    <span>رجوع</span>
                </button>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-8">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">اسم المهمة</label>
                            <input
                                type="text"
                                name="MissionName"
                                value={form.MissionName}
                                onChange={handleChange}
                                required
                                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                                placeholder="أدخل اسم المهمة"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">رقم المنسق</label>
                            <input
                                type="number"
                                name="CoordinatorNum"
                                value={form.CoordinatorNum}
                                onChange={handleChange}
                                required
                                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                                placeholder="أدخل رقم المنسق"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">السنة</label>
                            <select name="Year" value={form.Year} onChange={handleChange} required
                                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white">
                                <option value="">- اختر السنة -</option>
                                <option value={2025}>2025</option>
                                <option value={2026}>2026</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">الشهر</label>
                            <select name="Month" value={form.Month} onChange={handleChange} required
                                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white">
                                <option value="">- اختر الشهر -</option>
                                {[...Array(12)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">اليوم</label>
                            <select name="Day" value={form.Day} onChange={handleChange} required
                                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white">
                                <option value="">- اختر اليوم -</option>
                                {[...Array(31)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">مدة المهمة (يوم)</label>
                            <input
                                type="number"
                                name="DurationDays"
                                value={form.DurationDays}
                                onChange={handleChange}
                                required
                                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                                placeholder="عدد الأيام"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">التصنيف الرئيسي</label>
                            <select name="MainCategory" value={form.MainCategory} onChange={handleChange} required
                                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white">
                                <option value="">- اختر تصنيفًا -</option>
                                {mainCategories.map(mainCat => (
                                    <option key={mainCat.ID} value={mainCat.ID}>
                                        {mainCat.CategoryName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">التصنيف الفرعي</label>
                            <select name="SubCategory" value={form.SubCategory} onChange={handleChange} required
                                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white">
                                <option value="">- اختر تصنيفًا -</option>
                                {subCategories.map(subCat => (
                                    <option key={subCat.ID} value={subCat.ID}>
                                        {subCat.CategoryName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                        <button type="submit"
                            className="w-full md:w-auto px-8 py-3 bg-green-800 text-white font-semibold rounded-xl hover:bg-green-900 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                            <i className="fas fa-save"></i>
                            <span>حفظ</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
