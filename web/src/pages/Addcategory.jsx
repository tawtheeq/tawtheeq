import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function Addcategory() {
    const navigate = useNavigate();
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
            const response = await api.post("/api/categories", {
                ...form
            });

            console.log("Server response:", response.data);
            alert("تم إضافة التصنيف بنجاح!");

            // Reset form
            setForm({
                CategoryName: '',
                CategoryType: '',
                Description: '',
            });

            // Navigate back to categories page
            navigate('/dashboard/categories');
        } catch (error) {
            console.error("Error submitting data:", error);
            alert("حدث خطأ أثناء إضافة التصنيف: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="space-y-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/dashboard/categories')}
                        className="w-14 h-14 glass-card flex items-center justify-center text-gray-600 hover:bg-dark-green hover:text-white transition-all duration-300 group"
                    >
                        <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-1 text-dark-green">
                            <div className="w-1.5 h-6 bg-current rounded-full"></div>
                            <h1 className="text-3xl font-black tracking-tight text-gray-800">إضافة تصنيف جديد</h1>
                        </div>
                        <p className="text-gray-500 font-bold pr-4">إنشاء هيكلية جديدة لتنظيم المهام والمشاريع التوثيقية</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8">
                    <div className="glass-card p-10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-dark-green opacity-20"></div>

                        <form className="space-y-10" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">مسمى التصنيف</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-dark-green transition-colors">
                                            <i className="fas fa-tag"></i>
                                        </div>
                                        <input
                                            type="text"
                                            name="CategoryName"
                                            value={form.CategoryName}
                                            onChange={handleChange}
                                            required
                                            className="w-full pr-12 pl-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-dark-green/30 focus:bg-white outline-none font-bold text-gray-800 transition-all placeholder:text-gray-300"
                                            placeholder="مثال: تصوير فعاليات"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">نوع التصنيف</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-dark-green transition-colors">
                                            <i className="fas fa-layer-group"></i>
                                        </div>
                                        <select
                                            name="CategoryType"
                                            value={form.CategoryType}
                                            onChange={handleChange}
                                            required
                                            className="w-full pr-12 pl-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-dark-green/30 focus:bg-white outline-none font-black text-gray-800 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">- اختر النوع -</option>
                                            <option value="main">تصنيف رئيسي</option>
                                            <option value="sub">تصنيف فرعي</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">وصف التصنيف</label>
                                <div className="relative group">
                                    <div className="absolute top-4 right-4 text-gray-400 group-focus-within:text-dark-green transition-colors">
                                        <i className="fas fa-align-right"></i>
                                    </div>
                                    <textarea
                                        name="Description"
                                        value={form.Description}
                                        onChange={handleChange}
                                        required
                                        rows="4"
                                        className="w-full pr-12 pl-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-dark-green/30 focus:bg-white outline-none font-bold text-gray-800 transition-all placeholder:text-gray-300 resize-none"
                                        placeholder="اكتب وصفاً مختصراً يوضح الغرض من هذا التصنيف..."
                                    ></textarea>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                                <button
                                    type="submit"
                                    className="flex-1 py-6 premium-gradient text-white rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-4 hover:shadow-2xl hover:shadow-green-900/40 transition-all active:scale-[0.98]"
                                >
                                    <i className="fas fa-plus-circle text-2xl"></i>
                                    <span>إضافة التصنيف الآن</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard/categories')}
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
                        <div className="absolute top-0 right-0 w-32 h-32 bg-dark-green/20 rounded-full blur-[60px]"></div>
                        <div className="relative z-10 space-y-6">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-dark-green text-xl">
                                <i className="fas fa-lightbulb"></i>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-xl font-black">ما هي أنواع التصنيفات؟</h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 bg-dark-green rounded-full mt-1.5 shrink-0"></div>
                                        <p className="text-xs font-bold text-gray-400 leading-relaxed">
                                            <span className="text-white block mb-1">تصنيف رئيسي:</span>
                                            يستخدم لتحديد نوع المهمة الكبير مثل (عمليات تصوير، مونتاج، أرشيف).
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0"></div>
                                        <p className="text-xs font-bold text-gray-400 leading-relaxed">
                                            <span className="text-white block mb-1">تصنيف فرعي:</span>
                                            يقسم التصنيف الرئيسي لأجزاء أدق مثل (تصوير جوي، تصوير بورتريه).
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8 flex flex-col items-center text-center space-y-6">
                        <div className="w-20 h-20 rounded-[2rem] bg-slate-50 text-slate-400 flex items-center justify-center text-3xl shadow-inner border-2 border-white">
                            <i className="fas fa-sitemap"></i>
                        </div>
                        <p className="text-sm font-bold text-gray-400">تنظيم التصنيفات بشكل جيد يساعد في استخراج تقارير أدق حول أداء الفريق وتوزيع العمل.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

