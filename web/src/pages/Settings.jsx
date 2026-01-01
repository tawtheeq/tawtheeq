
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    department: '',
    category: '',
    status: '',
    priority: ''
  });


  // بيانات القوائم المنسدلة
  const selectOptions = {
    department: ['قسم الإعلام', 'قسم التوثيق', 'قسم المتابعة', 'قسم التقارير'],
    category: ['تقارير', 'أخبار', 'بيانات', 'إحصائيات'],
    status: ['جديد', 'قيد التنفيذ', 'مكتمل', 'ملغي'],
    priority: ['عاجل', 'مرتفع', 'متوسط', 'منخفض']
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = (type) => {
    console.log(`تعديل ${type}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('بيانات النموذج:', formData);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">الإعدادات</h1>
        <p className="text-sm text-gray-500 mt-1">إدارة إعدادات النظام والإحصائيات</p>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/dashboard/categories/')}
          className="p-6 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl hover:shadow-lg transition-all text-right group"
        >
          <div className="flex items-center justify-between mb-3">
            <i className="fas fa-tags text-3xl text-green-700 group-hover:scale-110 transition-transform"></i>
            <i className="fas fa-arrow-left text-green-700"></i>
          </div>
          <h3 className="font-bold text-gray-800 mb-1">التصنيفات</h3>
          <p className="text-sm text-gray-600">إضافة وعرض التصنيفات</p>
        </button>

        <button
          onClick={() => navigate('/dashboard/users/')}
          className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl hover:shadow-lg transition-all text-right group"
        >
          <div className="flex items-center justify-between mb-3">
            <i className="fas fa-users text-3xl text-blue-700 group-hover:scale-110 transition-transform"></i>
            <i className="fas fa-arrow-left text-blue-700"></i>
          </div>
          <h3 className="font-bold text-gray-800 mb-1"> الموظفين</h3>
          <p className="text-sm text-gray-600">إضافة وعرض موظفين</p>
        </button>

        <button
          onClick={() => navigate('/dashboard/reports')}
          className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl hover:shadow-lg transition-all text-right group"
        >
          <div className="flex items-center justify-between mb-3">
            <i className="fas fa-chart-bar text-3xl text-purple-700 group-hover:scale-110 transition-transform"></i>
            <i className="fas fa-arrow-left text-purple-700"></i>
          </div>
          <h3 className="font-bold text-gray-800 mb-1">عرض التقارير</h3>
          <p className="text-sm text-gray-600">إحصائيات وتقارير مفصلة</p>
        </button>
      </div>

      {/* Danger Zone */}
      <div className="mt-8">
        <div className="border-2 border-red-200 rounded-2xl overflow-hidden bg-red-50/30">
          <div className="bg-red-100 px-6 py-4 border-b-2 border-red-200">
            <div className="flex items-center gap-3">
              <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
              <h2 className="text-xl font-bold text-red-800">منطقة الخطر</h2>
            </div>
            <p className="text-sm text-red-600 mt-1">إجراءات حساسة تتطلب الحذر</p>
          </div>

          <div className="p-6 space-y-4">
            {/* System Reset */}
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-red-200 hover:border-red-300 transition-colors">
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-1">إعادة تعيين النظام</h3>
                <p className="text-sm text-gray-600">حذف جميع البيانات وإعادة النظام إلى حالته الأولية</p>
              </div>
              <button
                disabled
                onClick={() => {
                  if (window.confirm('هل أنت متأكد من إعادة تعيين النظام؟ سيتم حذف جميع البيانات!')) {
                    console.log('System reset requested');
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                إعادة تعيين
              </button>
            </div>

            {/* Clear All Missions */}
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-red-200 hover:border-red-300 transition-colors">
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-1">حذف جميع المهام</h3>
                <p className="text-sm text-gray-600">حذف جميع المهام من قاعدة البيانات</p>
              </div>
              <button
                disabled
                onClick={() => {
                  if (window.confirm('هل أنت متأكد من حذف جميع المهام؟')) {
                    console.log('Clear all missions requested');
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                حذف الكل
              </button>
            </div>

            {/* Export Database */}
            {/* <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-orange-200 hover:border-orange-300 transition-colors">
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-1">تصدير قاعدة البيانات</h3>
                <p className="text-sm text-gray-600">تحميل نسخة احتياطية من قاعدة البيانات</p>
              </div>
              <button
                onClick={() => {
                  console.log('Export database requested');
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                تصدير
              </button>
            </div> */}
          </div>
        </div>
      </div>

    </div>
  );
}


