import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

import api from '../api/client';

export default function Categories() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/categories");
        // تأكد أن الـ API ترجع data داخل response.data.data
        setCategories(response.data.data || response.data);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">جاري التحميل...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">حدث خطأ: {error}</div>
      </div>
    );
  }

  const handleDelete = async (id) => {
    if (!id) return;
    const confirmDelete = window.confirm("هل أنت متأكد من حذف التصنيف؟");
    if (!confirmDelete) return;

    try {
      console.log("Deleting category with id:", id);
      await api.delete(`/api/categories/${id}`);
      // إزالة العنصر من الجدول بعد نجاح الحذف
      setCategories(prev => prev.filter(c => c.ID !== id));
      alert("تم الحذف بنجاح!");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الحذف: " + err.message);
    }
  };

  const handleAdd = () => {
    console.log('إضافة تصنيف جديد');
  };

  return (
    <div className="space-y-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate(-1)}
            className="w-14 h-14 glass-card flex items-center justify-center text-gray-600 hover:bg-dark-green hover:text-white transition-all duration-300 group"
          >
            <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1 text-dark-green">
              <div className="w-1.5 h-6 bg-current rounded-full"></div>
              <h1 className="text-3xl font-black tracking-tight text-gray-800">تصنيفات المحتوى</h1>
            </div>
            <p className="text-gray-500 font-bold pr-4">تنظيم وهيكلة أنواع المهام والمحتوى الفوتوغرافي</p>
          </div>
        </div>

        <Link
          to="addcategory"
          className="px-8 py-4 premium-gradient text-white font-black rounded-2xl hover:shadow-2xl hover:shadow-green-900/40 transition-all duration-300 flex items-center gap-3 active:scale-[0.98]"
        >
          <i className="fas fa-plus"></i>
          <span>إضافة تصنيف جديد</span>
        </Link>
      </div>

      {/* Categories List Container */}
      <div className="space-y-4">
        {/* Header for Desktop */}
        <div className="hidden lg:grid grid-cols-12 gap-4 px-10 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">
          <div className="col-span-4">التصنيف</div>
          <div className="col-span-2">النوع</div>
          <div className="col-span-4">الوصف</div>
          <div className="col-span-2 text-left">الإجراءات</div>
        </div>

        {/* Categories List */}
        <div className="space-y-4">
          {categories.length > 0 ? (
            categories.map(category => (
              <div key={category.ID} className="glass-card p-6 lg:p-4 group hover:bg-white transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 border-white/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1 h-full bg-dark-green opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-center px-4">
                  <div className="col-span-4 flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-dark-green text-xl shadow-inner border border-white group-hover:scale-110 transition-transform duration-500">
                      <i className="fas fa-tag"></i>
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-black text-gray-800 text-lg group-hover:text-dark-green transition-colors truncate">{category.CategoryName}</h3>
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">ID: #{category.ID}</p>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <span className={`inline-flex px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-colors ${category.CategoryType === 'main'
                      ? 'bg-purple-50 text-purple-700 border-purple-100 group-hover:bg-purple-100'
                      : 'bg-slate-50 text-slate-500 border-slate-100 group-hover:bg-slate-100'
                      }`}>
                      {category.CategoryType === 'main' ? 'تصنيف رئيسي' : 'تصنيف فرعي'}
                    </span>
                  </div>

                  <div className="col-span-4">
                    <p className="text-sm font-bold text-gray-400 line-clamp-1 h-5">{category.Description || 'لا يوجد وصف حالياً لهذا التصنيف'}</p>
                  </div>

                  <div className="col-span-2 flex justify-end gap-2">
                    <button
                      onClick={() => navigate(`update/${category.ID}`)}
                      className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-sm flex items-center justify-center"
                      title="تعديل"
                    >
                      <i className="fas fa-edit text-sm"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(category.ID)}
                      className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm flex items-center justify-center"
                      title="حذف"
                    >
                      <i className="fas fa-trash-alt text-sm"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="glass-card p-20 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 text-5xl">
                <i className="fas fa-tags"></i>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-800">قائمة فارغة</h3>
                <p className="text-gray-400 font-bold max-w-xs mx-auto">لم يتم تسجيل أي تصنيف حتى الآن، ابدأ بإضافة التصنيفات لتنظيم المهام</p>
              </div>
              <Link to="addcategory" className="px-8 py-3 bg-dark-green text-white font-black rounded-2xl shadow-lg shadow-green-900/10 hover:shadow-2xl transition-all">إضافة أول تصنيف</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}




