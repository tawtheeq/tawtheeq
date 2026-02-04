import { useEffect, useState } from 'react';

import api from '../api/client';
import { useNavigate } from 'react-router-dom';
import { validateSaudiPhone } from '../utils/phoneValidation';

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
        CoordinatorName: '',
        CoordinatorNum: '',
        MainCategory: '',
        SubCategory: '',
        Day: '',
        Month: '',
        Year: '',
        Type: '',
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
                    api.get("/api/maincategories"),
                    api.get("/api/subcategories"),
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



    const numericFields = ["MainCategory", "SubCategory", "Year", "Month", "Day", "DurationDays", "CreatedBy"];




    const handleChange = (e) => {
        const { name, value } = e.target;

        // Handle phone validation for CoordinatorNum field
        if (name === "CoordinatorNum") {
            const validatedPhone = validateSaudiPhone(value);

            // Only update if the phone is valid
            if (validatedPhone !== null) {
                setForm({ ...form, CoordinatorNum: validatedPhone });
            }
            return; // Exit early to prevent the code below from running
        }

        // Handle all other fields normally
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

            console.log("Form data:", form);
            const response = await api.post("/api/missions", {
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
        <div className="space-y-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/dashboard/missions')}
                        className="w-14 h-14 glass-card flex items-center justify-center text-gray-600 hover:bg-dark-green hover:text-white transition-all duration-300 group"
                    >
                        <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-1 text-dark-green">
                            <div className="w-1.5 h-6 bg-current rounded-full"></div>
                            <h1 className="text-3xl font-black tracking-tight text-gray-800">إضافة مهمة جديدة</h1>
                        </div>
                        <p className="text-gray-500 font-bold pr-4">جدولة مهمة تصوير جديدة</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8">
                    <div className="glass-card p-10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 premium-gradient opacity-60"></div>

                        <form className="space-y-12" onSubmit={handleSubmit}>
                            {/* Time Period Section */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 bg-dark-green/10 text-dark-green rounded-lg flex items-center justify-center text-sm">
                                        <i className="fas fa-calendar-alt"></i>
                                    </div>
                                    <h2 className="text-xl font-black text-gray-800">الفترة الزمنية</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                                    <div className="md:col-span-8 space-y-6">
                                        {/* Start Date */}
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">تاريخ البداية</label>
                                            <div className="grid grid-cols-3 gap-3">
                                                <select
                                                    name="Day"
                                                    value={form.Day}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-dark-green/30 focus:bg-white outline-none font-bold text-gray-800 transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="">اليوم</option>
                                                    {[...Array(31)].map((_, i) => (
                                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                    ))}
                                                </select>
                                                <select
                                                    name="Month"
                                                    value={form.Month}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-dark-green/30 focus:bg-white outline-none font-bold text-gray-800 transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="">الشهر</option>
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
                                                    name="Year"
                                                    value={form.Year}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-dark-green/30 focus:bg-white outline-none font-bold text-gray-800 transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="">السنة</option>
                                                    <option value={2025}>2025</option>
                                                    <option value={2026}>2026</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* End Date */}
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">تاريخ النهاية المتوقع</label>
                                            <div className="grid grid-cols-3 gap-3">
                                                <select
                                                    name="Day"
                                                    value={endDate.Day}
                                                    onChange={handleEndDateChange}
                                                    required
                                                    className="w-full px-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-blue-500/30 focus:bg-white outline-none font-bold text-gray-800 transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="">اليوم</option>
                                                    {[...Array(31)].map((_, i) => (
                                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                    ))}
                                                </select>
                                                <select
                                                    name="Month"
                                                    value={endDate.Month}
                                                    onChange={handleEndDateChange}
                                                    required
                                                    className="w-full px-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-blue-500/30 focus:bg-white outline-none font-bold text-gray-800 transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="">الشهر</option>
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
                                                    name="Year"
                                                    value={endDate.Year}
                                                    onChange={handleEndDateChange}
                                                    required
                                                    className="w-full px-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-blue-500/30 focus:bg-white outline-none font-bold text-gray-800 transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="">السنة</option>
                                                    <option value={2025}>2025</option>
                                                    <option value={2026}>2026</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:col-span-4 h-full">
                                        <div className="h-full glass-card bg-slate-50 border-transparent p-6 flex flex-col items-center justify-center text-center space-y-3 relative group overflow-hidden">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-dark-green/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-dark-green/10 transition-all duration-700"></div>
                                            <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">مدة المهمة</div>
                                            <div className="text-6xl font-black text-dark-green tracking-tighter">{form.DurationDays || '0'}</div>
                                            <div className="text-sm font-black text-dark-green opacity-60">أيام عمل</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mission Details Section */}
                            <div className="space-y-8 pt-10 border-t border-gray-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-sm">
                                        <i className="fas fa-file-invoice"></i>
                                    </div>
                                    <h2 className="text-xl font-black text-gray-800">تفاصيل المهمة</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">مسمى المهمة</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-dark-green transition-colors">
                                                <i className="fas fa-pen-nib"></i>
                                            </div>
                                            <input
                                                type="text"
                                                name="MissionName"
                                                value={form.MissionName}
                                                onChange={handleChange}
                                                required
                                                className="w-full pr-12 pl-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-dark-green/30 focus:bg-white outline-none font-bold text-gray-800 transition-all placeholder:text-gray-300"
                                                placeholder="مثلاً: تغطية فعاليات يوم التأسيس"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">التصنيف الرئيسي</label>
                                        <select
                                            name="MainCategory"
                                            value={form.MainCategory}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-dark-green/30 focus:bg-white outline-none font-black text-gray-800 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">- اختر التصنيف -</option>
                                            {mainCategories.map((mainCat) => (
                                                <option key={mainCat.ID} value={mainCat.ID}>
                                                    {mainCat.CategoryName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">التصنيف الفرعي</label>
                                        <select
                                            name="SubCategory"
                                            value={form.SubCategory}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-dark-green/30 focus:bg-white outline-none font-black text-gray-800 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">- اختر التصنيف الفرعي -</option>
                                            {subCategories.map((subCat) => (
                                                <option key={subCat.ID} value={subCat.ID}>
                                                    {subCat.CategoryName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">نطاق المهمة</label>
                                        <div className="flex gap-4">
                                            {['internal', 'external'].map((type) => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => handleChange({ target: { name: 'Type', value: type } })}
                                                    className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all border-2 ${form.Type === type
                                                        ? 'bg-dark-green/5 border-dark-green text-dark-green shadow-lg shadow-dark-green/5'
                                                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                                                        }`}
                                                >
                                                    {type === 'internal' ? 'مهمة داخلية' : 'مهمة خارجية'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">رقم الموظف المسؤول</label>
                                        <input
                                            type="number"
                                            name="CreatedBy"
                                            value={form.CreatedBy}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-dark-green/30 focus:bg-white outline-none font-black text-gray-800 transition-all"
                                            placeholder="أدخل المعرف الخاص بك"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Coordinator Section */}
                            <div className="space-y-8 pt-10 border-t border-gray-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center text-sm">
                                        <i className="fas fa-user-tie"></i>
                                    </div>
                                    <h2 className="text-xl font-black text-gray-800">بيانات التنسيق</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">اسم المنسق الميداني</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-amber-500 transition-colors">
                                                <i className="fas fa-user-circle"></i>
                                            </div>
                                            <input
                                                type="text"
                                                name="CoordinatorName"
                                                value={form.CoordinatorName}
                                                onChange={handleChange}
                                                required
                                                className="w-full pr-12 pl-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-amber-500/30 focus:bg-white outline-none font-bold text-gray-800 transition-all placeholder:text-gray-300"
                                                placeholder="اسم الشخص المسؤول من الجهة"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">رقم تواصل المنسق</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-amber-500 transition-colors">
                                                <i className="fas fa-mobile-alt"></i>
                                            </div>
                                            <input
                                                type="text"
                                                name="CoordinatorNum"
                                                dir="ltr"
                                                value={form.CoordinatorNum}
                                                onChange={handleChange}
                                                required
                                                className="w-full pr-12 pl-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-amber-500/30 focus:bg-white outline-none font-bold text-gray-800 transition-all text-right placeholder:text-gray-300"
                                                placeholder="+966 5x xxx xxxx"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-10">
                                <button
                                    type="submit"
                                    className="flex-1 py-6 premium-gradient text-white rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-4 hover:shadow-2xl hover:shadow-green-900/40 transition-all active:scale-[0.98]"
                                >
                                    <i className="fas fa-check-double text-2xl"></i>
                                    <span>تسجيل المهمة في النظام</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard/missions')}
                                    className="px-12 py-6 bg-slate-100 text-slate-500 rounded-[2.5rem] font-black hover:bg-slate-200 transition-all"
                                >
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="glass-card p-8 bg-slate-900 text-white relative overflow-hidden group border-none">
                        {/* <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-dark-green/20"></div> */}
                        <div className="relative z-10 space-y-6">
                            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl">
                                <i className="fas fa-lightbulb text-amber-400"></i>
                            </div>
                            <div>
                                <h3 className="text-xl font-black mb-2">تعليمات الجدولة</h3>
                                <p className="text-sm font-bold text-gray-400 leading-relaxed">يرجى التأكد من دقة المواعيد لضمان تفرغ أعضاء الفريق المختارين للمهمة، حيث سيقوم النظام تلقائياً بحساب الاستحقاقات بناءً على المدة.</p>
                            </div>
                            <div className="space-y-3 pt-4 border-t border-white/5">
                                <div className="flex items-center gap-3 text-xs font-black text-gray-400">
                                    <div className="w-1.5 h-1.5 rounded-full bg-dark-green"></div>
                                    <span>يمنع تداخل المواعيد للموظف الواحد</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs font-black text-gray-400">
                                    <div className="w-1.5 h-1.5 rounded-full bg-dark-green"></div>
                                    <span>يتم   خصم الرصيد بناء على نوع المهمة</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8 border-dashed border-2 border-slate-200 flex flex-col items-center justify-center text-center space-y-6 opacity-80">
                        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 text-4xl">
                            <i className="fas fa-shield-check"></i>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-black text-gray-500">نظام إدارة المهام</h4>
                            <p className="text-[10px] font-bold text-gray-400 leading-relaxed leading-relaxed">يخضع تسجيل المهام لبروتوكولات الجودة المعمول بها في إدارة الإنتاج الفني</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

