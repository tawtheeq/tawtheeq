import { useEffect, useState } from 'react';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Addmission() {

    const navigate = useNavigate();

    const [mainCategories, setMainCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedMain, setSelectedMain] = useState("");
    const [selectedSub, setSelectedSub] = useState("");
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
        CreatedBy: '',
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const [mainRes, subRes] = await Promise.all([
                    axios.get("/api/maincategories"),
                    axios.get("/api/subcategories"),
                ]);

                setMainCategories(mainRes.data.data || []);
                setSubCategories(subRes.data.data || []);
            } catch (err) {
                setError(err.message);
                alert(err.message)
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) return <p>Loading categories...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;


    // const photographers = [
    //     { id: 1, name: 'أحمد', delegationBalance: 5, leaves: [{ from: '2025-08-14', to: '2025-09-23' }] },
    //     { id: 2, name: 'سارة', delegationBalance: 0, leaves: [] },
    //     { id: 3, name: 'خالد', delegationBalance: 3, leaves: [{ from: '2025-08-14', to: '2025-09-01' }] },
    //     { id: 4, name: 'مريم', delegationBalance: 2, leaves: [] },
    //     { id: 5, name: 'يوسف', delegationBalance: 1, leaves: [{ from: '2025-09-10', to: '2025-09-15' }] },
    // ];


    // const taskStart = '2025-09-13';
    // const taskEnd = '2025-09-20';



    const numericFields = ["CoordinatorNum", "MainCategory", "SubCategory", "Year", "Month", "Day", "DurationDays", "CreatedBy"];

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: numericFields.includes(name) ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(form);
        try {
            const response = await axios.post("/api/missions", {
                ...form
            });

            console.log("Server response:", response.data);
            alert("Data submitted successfully!");
            const missionId = response.data.data.ID;

            const missionIdInt = Number(missionId);
            alert("missionIdInt: " + missionIdInt);
            navigate(`/dashboard/missions/${missionIdInt}`);
        } catch (error) {
            console.log("SERVER ERROR:", error.response?.data);
            alert("Error occurred while submitting data!");
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">إضافة مهمة جديدة</h1>
                    <p className="text-gray-500 mt-1">أدخل تفاصيل المهمة الجديدة</p>
                </div>
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
                            <select
                                name="Year"
                                value={form.Year}
                                onChange={handleChange}
                                required
                                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                            >
                                <option value="">- اختر السنة -</option>
                                <option value={2025}>2025</option>
                                <option value={2026}>2026</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">الشهر</label>
                            <select
                                name="Month"
                                value={form.Month}
                                onChange={handleChange}
                                required
                                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                            >
                                <option value="">- اختر الشهر -</option>
                                <option value={1}>يناير</option>
                                <option value={2}>فبراير</option>
                                <option value={3}>مارس</option>
                                <option value={4}>أبريل</option>
                                <option value={5}>مايو</option>
                                <option value={6}>يونيو</option>
                                <option value={7}>يوليو</option>
                                <option value={8}>أغسطس</option>
                                <option value={9}>سبتمبر</option>
                                <option value={10}>أكتوبر</option>
                                <option value={11}>نوفمبر</option>
                                <option value={12}>ديسمبر</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">اليوم</label>
                            <select
                                name="Day"
                                value={form.Day}
                                onChange={handleChange}
                                required
                                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                            >
                                <option value="">- اختر اليوم -</option>
                                {[...Array(31)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">مدة المهمة (أيام)</label>
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">التصنيف الرئيسي</label>
                            <select
                                name="MainCategory"
                                value={form.MainCategory}
                                onChange={handleChange}
                                required
                                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                            >
                                <option value="">- اختر تصنيفًا -</option>
                                {mainCategories.map((mainCat) => (
                                    <option key={mainCat.ID} value={mainCat.ID}>
                                        {mainCat.CategoryName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">التصنيف الفرعي</label>
                            <select
                                name="SubCategory"
                                value={form.SubCategory}
                                onChange={handleChange}
                                required
                                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                            >
                                <option value="">- اختر تصنيفًا -</option>
                                {subCategories.map((subCat) => (
                                    <option key={subCat.ID} value={subCat.ID}>
                                        {subCat.CategoryName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">تمت الإضافة بواسطة</label>
                            <input
                                name="CreatedBy"
                                value={form.CreatedBy}
                                onChange={handleChange}
                                required
                                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                                placeholder="اسم المستخدم"
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            className="w-full md:w-auto px-8 py-3 bg-green-800 text-white font-semibold rounded-xl hover:bg-green-900 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                            <i className="fas fa-plus"></i>
                            <span>حفظ المهمة</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
