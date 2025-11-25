
import { useState } from 'react';
import '../styles/pages/settings.scss';

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
    <div className="settings-container">
   
      <div className="stats-cards">
        {statsData.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="card-content">
              <div className="title">{stat.title}</div>
              <div className="value">{stat.value}</div>
            </div>
            <button 
              className="function-button"
              onClick={() => handleEdit(stat.type)}
            >
              تعديل
            </button>
          </div>
        ))}
      </div>

      {/* نموذج الإعدادات */}
     <form className="input-form" onSubmit={handleSubmit}>
        <h2 className="form-title">إعدادات النظام</h2>
        
        <div className="form-row">
          {Object.entries(selectOptions).map(([key, options]) => (
            <div key={key} className="form-group">
              <label htmlFor={key}>
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

        <div className="form-actions">
          <button type="button" className="function-button">
            إلغاء
          </button>
          <button type="submit" className="function-button">
            حفظ التغييرات
          </button>
        </div>
      </form> 
    </div>
  );
}


