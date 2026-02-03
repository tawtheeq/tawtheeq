import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

import api from '../api/client';
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
                    api.get("/api/maincategories"),
                    api.get("/api/subcategories"),
                    api.get(`/api/missions/${id}`)
                ]);

                console.log("Fetched mission data:", missionRes.data.data);
                setMainCategories(mainRes.data.data || []);
                setSubCategories(subRes.data.data || []);


                const mission = missionRes.data.data;
                // alert(JSON.stringify(mission));
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-dark-green/20 border-t-dark-green rounded-full animate-spin"></div>
                    <div className="text-lg font-black text-gray-400">جاري تحميل بيانات المهمة...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="glass-card p-10 flex flex-col items-center gap-6 max-w-sm text-center">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center text-2xl">
                        <i className="fas fa-exclamation-circle"></i>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-gray-800">تعذر الوصول للمهمة</h3>
                        <p className="text-sm font-bold text-gray-400 leading-relaxed">{error}</p>
                    </div>
                    <button onClick={() => navigate(-1)} className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all">العودة للخلف</button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-14 h-14 glass-card flex items-center justify-center text-gray-600 hover:bg-amber-500 hover:text-white transition-all duration-300 group"
                    >
                        <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-1 text-amber-600">
                            <div className="w-1.5 h-6 bg-current rounded-full"></div>
                            <h1 className="text-3xl font-black tracking-tight text-gray-800">تعديل بيانات المهمة</h1>
                        </div>
                        <p className="text-gray-500 font-bold pr-4">تحديث الجدول الزمني والتصنيفات لهذه المهمة</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8">
                    <div className="glass-card p-10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-amber-500/60 opacity-60"></div>

                        <form className="space-y-12" onSubmit={handleSubmit}>
                            {/* Mission Details Section */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center text-sm">
                                        <i className="fas fa-edit"></i>
                                    </div>
                                    <h2 className="text-xl font-black text-gray-800">البيانات الأساسية</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">مسمى المهمة</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-amber-500 transition-colors">
                                                <i className="fas fa-folder-open"></i>
                                            </div>
                                            <input
                                                type="text"
                                                name="MissionName"
                                                value={form.MissionName}
                                                onChange={handleChange}
                                                required
                                                className="w-full pr-12 pl-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-amber-500/30 focus:bg-white outline-none font-bold text-gray-800 transition-all placeholder:text-gray-300"
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
                                            className="w-full px-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-amber-500/30 focus:bg-white outline-none font-black text-gray-800 transition-all appearance-none cursor-pointer"
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
                                            className="w-full px-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-amber-500/30 focus:bg-white outline-none font-black text-gray-800 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">- اختر التصنيف الفرعي -</option>
                                            {subCategories.map((subCat) => (
                                                <option key={subCat.ID} value={subCat.ID}>
                                                    {subCat.CategoryName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Timing Section */}
                            <div className="space-y-8 pt-10 border-t border-gray-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-sm">
                                        <i className="fas fa-calendar-alt"></i>
                                    </div>
                                    <h2 className="text-xl font-black text-gray-800">التوقيت والمدة</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div className="md:col-span-3 grid grid-cols-3 gap-3">
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">اليوم</label>
                                            <select name="Day" value={form.Day} onChange={handleChange} required
                                                className="w-full px-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-blue-500/30 focus:bg-white outline-none font-black text-gray-800 transition-all appearance-none cursor-pointer">
                                                {[...Array(31)].map((_, i) => (
                                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">الشهر</label>
                                            <select name="Month" value={form.Month} onChange={handleChange} required
                                                className="w-full px-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-blue-500/30 focus:bg-white outline-none font-black text-gray-800 transition-all appearance-none cursor-pointer">
                                                {[...Array(12)].map((_, i) => (
                                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">السنة</label>
                                            <select name="Year" value={form.Year} onChange={handleChange} required
                                                className="w-full px-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-blue-500/30 focus:bg-white outline-none font-black text-gray-800 transition-all appearance-none cursor-pointer">
                                                <option value={2025}>2025</option>
                                                <option value={2026}>2026</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">المدة (يوم)</label>
                                        <input
                                            type="number"
                                            name="DurationDays"
                                            value={form.DurationDays}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-blue-500/30 focus:bg-white outline-none font-black text-gray-800 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Coordinator Section */}
                            <div className="space-y-8 pt-10 border-t border-gray-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center text-sm">
                                        <i className="fas fa-headset"></i>
                                    </div>
                                    <h2 className="text-xl font-black text-gray-800">بيانات التواصل</h2>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">رقم المنسق</label>
                                    <div className="relative group max-w-md">
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                                            <i className="fas fa-phone-alt"></i>
                                        </div>
                                        <input
                                            type="number"
                                            name="CoordinatorNum"
                                            dir="ltr"
                                            value={form.CoordinatorNum}
                                            onChange={handleChange}
                                            required
                                            className="w-full pr-12 pl-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-emerald-500/30 focus:bg-white outline-none font-bold text-gray-800 transition-all text-right"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-10">
                                <button
                                    type="submit"
                                    className="flex-1 py-6 premium-gradient-amber text-white rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-4 hover:shadow-2xl hover:shadow-amber-900/40 transition-all active:scale-[0.98]"
                                >
                                    <i className="fas fa-save text-2xl"></i>
                                    <span>حفظ التعديلات الجديدة</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="px-12 py-6 bg-slate-100 text-slate-500 rounded-[2.5rem] font-black hover:bg-slate-200 transition-all"
                                >
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="glass-card p-8 flex flex-col items-center text-center space-y-6">
                        <div className="w-20 h-20 rounded-[2rem] bg-amber-50 text-amber-500 flex items-center justify-center text-3xl shadow-inner border-2 border-white">
                            <i className="fas fa-mission"></i>
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-800">مهمة نشطة</h3>
                            <p className="text-xs font-black text-amber-500 uppercase tracking-widest mt-1">ID: #{id}</p>
                        </div>
                        <div className="w-full pt-6 border-t border-gray-50 flex items-center justify-between text-xs font-bold text-gray-400">
                            <span>تاريخ الإنشاء</span>
                            <span>{form.Year}/{form.Month}/{form.Day}</span>
                        </div>
                    </div>

                    <div className="glass-card p-8 bg-slate-900 text-white relative overflow-hidden group border-none">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-[60px]"></div>
                        <div className="relative z-10 space-y-4">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-amber-400">
                                <i className="fas fa-info-circle"></i>
                            </div>
                            <h3 className="text-lg font-black">تحذير الجدولة</h3>
                            <p className="text-xs font-bold text-gray-400 leading-relaxed">تعديل مواعيد المهمة قد يؤثر على توافر المصورين المشاركين في هذه الفترة. يرجى مراجعة قائمة المشاركين بعد التعديل.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

