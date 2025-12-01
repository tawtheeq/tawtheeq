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

    // Separate state for end date
    const [endDate, setEndDate] = useState({
        Day: '',
        Month: '',
        Year: ''
    });

    // Calculate duration whenever start or end date changes
    useEffect(() => {
        if (form.Year && form.Month && form.Day && endDate.Year && endDate.Month && endDate.Day) {
            const startDate = new Date(form.Year, form.Month - 1, form.Day);
            const endDateObj = new Date(endDate.Year, endDate.Month - 1, endDate.Day);

            // Calculate difference in days
            const diffTime = endDateObj - startDate;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // Update duration if valid (positive number)
            if (diffDays >= 0) {
                setForm(prev => ({ ...prev, DurationDays: diffDays }));
            }
        }
    }, [form.Year, form.Month, form.Day, endDate.Year, endDate.Month, endDate.Day]);

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

    const handleEndDateChange = (e) => {
        const { name, value } = e.target;
        // Assuming endDate fields (Day, Month, Year) are numeric
        setEndDate(prev => ({
            ...prev,
            [name]: Number(value),
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
                    {/* <div className="flex items-center gap-3 mb-4">
                        <div className="h-8 w-1 bg-green-800 rounded-full"></div>
                        <h2 className="text-lg font-bold text-gray-800">البيانات الأساسية</h2>
                    </div> */}



                    {/* Date Grid: Start Date (Row 1) + End Date (Row 2) + Duration (Spans both rows) */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Start Date - Row 1, Columns 1-3 */}
                        <div className="md:col-span-3 space-y-3">
                            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-xl border border-green-100">
                                <i className="fas fa-calendar-alt text-green-700"></i>
                                <span className="text-sm font-semibold text-green-800">تاريخ بداية المهمة</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
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
                        </div>

                        {/* Duration - Spans 2 rows, Column 4 */}
                        <div className="md:row-span-2 flex flex-col items-center justify-center">
                            <div className="flex flex-col h-full w-full space-y-3">
                                <div className="flex items-center justify-center gap-2 px-3 py-2 bg-purple-50 rounded-xl border border-purple-100">
                                    <i className="fas fa-clock text-purple-700"></i>
                                    <span className="text-sm font-semibold text-purple-800">إجمالي المدة</span>
                                </div>
                                <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border-2 border-purple-200 p-8 min-h-[160px]">
                                    <div className="text-5xl font-bold text-purple-800">{form.DurationDays || '0'}</div>
                                    <div className="text-base font-medium text-purple-600 mt-2">يوم</div>
                                </div>
                            </div>
                        </div>

                        {/* End Date - Row 2, Columns 1-3 */}
                        <div className="md:col-span-3 space-y-3">
                            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-xl border border-blue-100">
                                <i className="fas fa-calendar-check text-blue-700"></i>
                                <span className="text-sm font-semibold text-blue-800">تاريخ نهاية المهمة</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <select
                                    name="Year"
                                    value={endDate.Year}
                                    onChange={handleEndDateChange}
                                    required
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                                >
                                    <option value="">- اختر السنة -</option>
                                    <option value={2025}>2025</option>
                                    <option value={2026}>2026</option>
                                </select>
                                <select
                                    name="Month"
                                    value={endDate.Month}
                                    onChange={handleEndDateChange}
                                    required
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
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
                                <select
                                    name="Day"
                                    value={endDate.Day}
                                    onChange={handleEndDateChange}
                                    required
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                                >
                                    <option value="">- اختر اليوم -</option>
                                    {[...Array(31)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>





                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-4 space-y-3">

                            <div className="md:col-span-2 flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-xl border border-blue-100">
                                <i className="fas fa-calendar-check text-blue-700"></i>
                                <span className="text-sm font-semibold text-blue-800">  تفاصيل المهمة</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="col-span-2 space-y-2">
                                    {/* <label className="text-sm font-medium text-gray-700">اسم المهمة</label> */}
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
                                    {/* <label className="text-sm font-medium text-gray-700">رقم المنسق</label> */}
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
                                <div className="space-y-2">
                                    {/* <label className="text-sm font-medium text-gray-700">التصنيف الرئيسي</label> */}
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
                                    {/* <label className="text-sm font-medium text-gray-700">التصنيف الفرعي</label> */}
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
                                    {/* <label className="text-sm font-medium text-gray-700">تمت الإضافة بواسطة</label> */}
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
