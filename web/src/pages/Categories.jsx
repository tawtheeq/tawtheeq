import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';

export default function Categories() {

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
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
      await axios.delete(`/api/categories/${id}`);
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
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">التصنيفات</h1>
          <p className="text-sm text-gray-500 mt-1">إدارة تصنيفات المحتوى ({categories.length})</p>
        </div>
        <Link
          to="addcategory"
          className="px-4 py-2 bg-green-700 text-white rounded-xl hover:bg-green-800 transition-colors flex items-center gap-2"
        >
          <i className="fas fa-plus"></i>
          إضافة تصنيف
        </Link>
      </div>

      {/* Categories Table */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">اسم التصنيف</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">النوع</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">مختصر الوصف</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.length > 0 ? (
                categories.map(category => (
                  <tr key={category.ID} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-800">{category.CategoryName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${category.CategoryType === 'main'
                        ? 'bg-purple-50 text-purple-700 border-purple-100'
                        : 'bg-gray-50 text-gray-700 border-gray-100'
                        }`}>
                        {category.CategoryType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{category.Description}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors"
                          title="تعديل"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-red-600 hover:bg-red-50 transition-colors"
                          onClick={() => handleDelete(category.ID)}
                          title="حذف"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                        <i className="fas fa-tags text-2xl"></i>
                      </div>
                      <p className="text-lg font-medium">لا يوجد تصنيفات حالياً</p>
                      <p className="text-sm">قم بإضافة تصنيف جديد للبدء</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
