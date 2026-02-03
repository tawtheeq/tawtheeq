
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
    <div className="space-y-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 glass-card flex items-center justify-center text-dark-green text-2xl shadow-lg ring-1 ring-white/50">
            <i className="fas fa-cog animate-spin-slow"></i>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1 text-dark-green">
              <div className="w-1.5 h-6 bg-current rounded-full"></div>
              <h1 className="text-3xl font-black tracking-tight text-gray-800 uppercase">إعدادات النظام</h1>
            </div>
            <p className="text-gray-500 font-bold pr-4">تهيئة تفضيلات المنصة، إدارة الهيكلية، وتأمين البيانات</p>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: 'التصنيفات',
            desc: 'إدارة هيكلية المهام والمشاريع',
            icon: 'fa-tags',
            color: 'green',
            path: '/dashboard/categories/',
            accent: 'bg-dark-green'
          },
          {
            title: 'إدارة الموظفين',
            desc: 'التحكم في العضويات والصلاحيات',
            icon: 'fa-users',
            color: 'blue',
            path: '/dashboard/users/',
            accent: 'bg-blue-600'
          },
          {
            title: 'تقارير الأداء',
            desc: 'تحليل الإحصائيات والمخرجات',
            icon: 'fa-chart-pie',
            color: 'purple',
            path: '/dashboard/reports',
            accent: 'bg-purple-600'
          }
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={() => navigate(item.path)}
            className="glass-card p-8 group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 text-right active:scale-95"
          >
            <div className={`absolute top-0 right-0 w-2 h-full ${item.accent} opacity-10 group-hover:opacity-100 transition-opacity`}></div>
            <div className="flex items-center justify-between mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${item.color === 'green' ? 'bg-green-50 text-dark-green' :
                  item.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                    'bg-purple-50 text-purple-600'
                }`}>
                <i className={`fas ${item.icon} group-hover:scale-125 transition-transform duration-500`}></i>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-dark-green group-hover:text-white transition-all">
                <i className="fas fa-chevron-left text-xs"></i>
              </div>
            </div>
            <h3 className="text-xl font-black text-gray-800 mb-2">{item.title}</h3>
            <p className="text-sm font-bold text-gray-400 leading-relaxed">{item.desc}</p>
          </button>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="relative">
        <div className="absolute inset-0 bg-rose-500/5 blur-3xl rounded-full"></div>
        <div className="glass-card relative overflow-hidden border-rose-100 bg-rose-50/20">
          <div className="bg-rose-500/10 px-8 py-6 border-b border-rose-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-rose-500/20">
                <i className="fas fa-fire"></i>
              </div>
              <div>
                <h2 className="text-xl font-black text-rose-900">منطقة العمليات الحساسة</h2>
                <p className="text-sm font-bold text-rose-600 opacity-70">إجراءات لا يمكن التراجع عنها بعد التنفيذ</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            {[
              {
                title: 'إعادة تعيين النظام بالكامل',
                desc: 'سيتم مسح كافة البيانات: المستخدمين، المهام، التصنيفات، والإعدادات.',
                btnText: 'تصفير المنصة',
                action: () => alert('هذا الإجراء معطل حالياً لأسباب أمنية')
              },
              {
                title: 'تطهير سجل المهام',
                desc: 'حذف جميع المهام المسجلة مسبقاً مع الاحتفاظ ببيانات الموظفين.',
                btnText: 'حذف كافة المهام',
                action: () => alert('هذا الإجراء معطل حالياً')
              }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col md:flex-row items-center justify-between p-6 bg-white/60 rounded-3xl border border-rose-100/50 gap-6">
                <div className="flex-1 text-center md:text-right">
                  <h3 className="font-black text-gray-800 text-lg mb-1">{item.title}</h3>
                  <p className="text-sm font-bold text-gray-400">{item.desc}</p>
                </div>
                <button
                  onClick={item.action}
                  className="px-8 py-4 bg-rose-50 text-rose-600 rounded-2xl font-black text-sm hover:bg-rose-600 hover:text-white transition-all duration-300 w-full md:w-auto"
                >
                  {item.btnText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}



