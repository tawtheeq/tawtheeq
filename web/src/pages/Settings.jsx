
import { useState } from 'react';

export default function Settings() {
  const [formData, setFormData] = useState({
    department: '',
    category: '',
    status: '',
    priority: ''
  });

  const statsData = [
    {
      title: 'إجمالي عدد المهام',
      value: '12',
      type: 'department'
    },
    {
      title: 'إجمالي عدد المصورين',
      value: '24',
      type: 'category'
    },
    {
      title: 'متوسط مدة المهمة',
      value: '8',
      type: 'status'
    },
    {
      title: 'الأولويات',
      value: '5',
      type: 'priority'
    }
  ];

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
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">الإعدادات</h1>
        <p className="text-gray-500 mt-1">إدارة إعدادات النظام والإحصائيات</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-500 mb-2">{stat.title}</div>
              <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
            </div>
            <button
              className="w-full px-4 py-2 bg-green-800 text-white text-sm font-semibold rounded-xl hover:bg-green-900 transition-all shadow-md hover:shadow-lg"
              onClick={() => handleEdit(stat.type)}
            >
              تعديل
            </button>
          </div>
        ))}
      </div>

      {/* Settings Form */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold text-gray-800 mb-6">إعدادات النظام</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(selectOptions).map(([key, options]) => (
              <div key={key} className="space-y-2">
                <label htmlFor={key} className="text-sm font-medium text-gray-700">
                  {key === 'department' && 'القسم'}
                  {key === 'category' && 'التصنيف'}
                  {key === 'status' && 'الحالة'}
                  {key === 'priority' && 'الأولوية'}
                </label>
                <select
                  id={key}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                >
                  <option value="">اختر...</option>
                  {options.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              className="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm hover:shadow-md font-semibold"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-green-800 text-white font-semibold rounded-xl hover:bg-green-900 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              حفظ التغييرات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


