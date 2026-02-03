import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function Overview() {
  const navigate = useNavigate();
  const [missions, setMissions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [missionsRes, usersRes] = await Promise.all([
          api.get('/api/missions'),
          api.get('/api/users')
        ]);
        setMissions(missionsRes.data.data || []);
        setUsers(usersRes.data.data || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching overview data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  // Calculate statistics
  const totalMissions = missions.length;
  const totalUsers = users.length;
  const usersWithFullBalance = users.filter(user => user.Balance >= 60).length;
  const usersWithLowBalance = users.filter(user => user.Balance < 20).length;

  // Get current date info
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  const currentDay = today.getDate();

  // Find ongoing missions (missions happening this month)
  const ongoingMissions = missions.filter(mission => {
    const missionDate = new Date(mission.Year, mission.Month - 1, mission.Day);
    const missionEndDate = new Date(missionDate);
    missionEndDate.setDate(missionEndDate.getDate() + mission.DurationDays);

    return today >= missionDate && today <= missionEndDate;
  });

  // Recent missions (this month)
  const recentMissions = missions.filter(mission =>
    mission.Month === currentMonth && mission.Year === currentYear
  ).slice(0, 5);

  const formatDate = (day, month, year) => {
    const months = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    return `${day} ${months[month - 1]} ${year}`;
  };

  const statsCards = [
    {
      title: 'إجمالي المهام',
      value: totalMissions,
      icon: 'fas fa-tasks',
      color: 'blue',
      change: `${ongoingMissions.length} جارية`
    },
    {
      title: 'إجمالي الموظفين',
      value: totalUsers,
      icon: 'fas fa-users',
      color: 'green',
      change: `${usersWithFullBalance} رصيد كامل`
    },
    {
      title: 'المهام الجارية',
      value: ongoingMissions.length,
      icon: 'fas fa-spinner',
      color: 'yellow',
      change: 'هذا الشهر'
    },
    {
      title: 'تنبيهات الرصيد',
      value: usersWithLowBalance,
      icon: 'fas fa-exclamation-triangle',
      color: 'red',
      change: 'رصيد منخفض'
    }
  ];

  return (
    <div className="space-y-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2 text-dark-green">
            <div className="w-2 h-8 bg-current rounded-full"></div>
            <h1 className="text-4xl font-black tracking-tight">لوحة التحكم</h1>
          </div>
          <p className="text-gray-500 font-bold pr-5">مرحباً بك مجدداً، إليك آخر التحديثات اليوم</p>
        </div>
        <div className="bg-white/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/40 shadow-sm flex items-center gap-4">
          <div className="text-left">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">تاريخ اليوم</div>
            <div className="text-sm font-black text-gray-800">{formatDate(currentDay, currentMonth, currentYear)}</div>
          </div>
          <div className="w-10 h-10 bg-dark-green/10 rounded-xl flex items-center justify-center text-dark-green">
            <i className="fas fa-calendar-day"></i>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div key={index} className="glass-card p-8 group hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl hover:shadow-green-900/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-dark-green/20 group-hover:bg-dark-green transition-colors duration-500"></div>
            <div className="flex items-center justify-between mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                stat.color === 'green' ? 'bg-green-50 text-green-600' :
                  stat.color === 'yellow' ? 'bg-yellow-50 text-yellow-600' :
                    'bg-red-50 text-red-600'
                }`}>
                <i className={stat.icon}></i>
              </div>
              <div className="bg-gray-100/50 px-3 py-1 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                {stat.change}
              </div>
            </div>
            <h3 className="text-gray-500 font-bold text-sm mb-1">{stat.title}</h3>
            <div className="text-4xl font-black text-gray-800 tracking-tighter">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ongoing & Recent Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section Title */}
          <div className="flex items-center gap-4 mb-2">
            <i className="fas fa-project-diagram text-dark-green text-xl"></i>
            <h2 className="text-2xl font-black text-gray-800">حالة المهام</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ongoing Missions Card */}
            <div className="glass-card flex flex-col h-[500px]">
              <div className="p-8 border-b border-gray-100/50 flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-800">المهام الجارية</h3>
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              </div>
              <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar">
                {ongoingMissions.length > 0 ? ongoingMissions.map(m => (
                  <div key={m.ID} onClick={() => navigate(`/dashboard/missions/${m.ID}`)} className="p-5 bg-white/50 border border-white hover:border-dark-green/30 hover:bg-white rounded-3xl transition-all duration-300 cursor-pointer group shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-black text-gray-800 group-hover:text-dark-green transition-colors">{m.MissionName}</h4>
                      <div className="bg-green-100/50 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">نشط</div>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                      <div className="flex items-center gap-1.5"><i className="far fa-clock"></i> {m.DurationDays} أيام</div>
                      <div className="flex items-center gap-1.5"><i className="far fa-calendar-alt"></i> {m.Day}/{m.Month}</div>
                    </div>
                  </div>
                )) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50 space-y-4">
                    <i className="fas fa-ghost text-5xl"></i>
                    <p className="font-bold">لا توجد مهام جارية حالياً</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Missions Card */}
            <div className="glass-card flex flex-col h-[500px]">
              <div className="p-8 border-b border-gray-100/50">
                <h3 className="text-xl font-black text-gray-800">المهام المضافة حديثاً</h3>
              </div>
              <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar">
                {recentMissions.length > 0 ? recentMissions.map(m => (
                  <div key={m.ID} onClick={() => navigate(`/dashboard/missions/${m.ID}`)} className="p-5 bg-white/50 border border-white hover:border-dark-green/30 hover:bg-white rounded-3xl transition-all duration-300 cursor-pointer group shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-black text-gray-800 group-hover:text-dark-green transition-colors">{m.MissionName}</h4>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${m.Type === 'external' ? 'bg-purple-100/50 text-purple-700' : 'bg-blue-100/50 text-blue-700'}`}>
                        {m.Type === 'external' ? 'خارجية' : 'داخلية'}
                      </div>
                    </div>
                    <div className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
                      <i className="far fa-calendar-check"></i> تم الإنشاء في {m.Day}/{m.Month}/{m.Year}
                    </div>
                  </div>
                )) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50 space-y-4">
                    <i className="fas fa-hourglass-start text-5xl"></i>
                    <p className="font-bold">لا توجد مهام مضافة مؤخراً</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Sidebar Area */}
        <div className="space-y-8">
          <div className="flex items-center gap-4 mb-2">
            <i className="fas fa-bolt text-yellow-500 text-xl"></i>
            <h2 className="text-2xl font-black text-gray-800">إجراءات سريعة</h2>
          </div>

          <div className="space-y-4">
            <button onClick={() => navigate('/dashboard/missions/addmission')} className="w-full group p-6 glass-card hover:premium-gradient transition-all duration-500 text-right overflow-hidden relative">
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 group-hover:bg-white/10 rounded-2xl flex items-center justify-center text-2xl text-green-700 group-hover:text-white mb-6 shadow-sm transition-colors duration-500">
                  <i className="fas fa-plus"></i>
                </div>
                <h4 className="text-xl font-black text-gray-800 group-hover:text-white mb-2 transition-colors duration-500">إضافة مهمة جديدة</h4>
                <p className="text-gray-500 group-hover:text-white/80 font-bold text-xs transition-colors duration-500 leading-relaxed">تنظيم وتوثيق مهمة إعلامية جديدة وإسنادها للموظفين</p>
              </div>
              <i className="fas fa-file-signature absolute -bottom-4 -left-4 text-8xl opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-700 text-black"></i>
            </button>

            <button onClick={() => navigate('/dashboard/users/addemp')} className="w-full group p-6 glass-card hover:bg-slate-800 transition-all duration-500 text-right overflow-hidden relative">
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 group-hover:bg-white/10 rounded-2xl flex items-center justify-center text-2xl text-blue-700 group-hover:text-blue-200 mb-6 shadow-sm transition-colors duration-500">
                  <i className="fas fa-user-plus"></i>
                </div>
                <h4 className="text-xl font-black text-gray-800 group-hover:text-white mb-2 transition-colors duration-500">تسجيل موظف</h4>
                <p className="text-gray-500 group-hover:text-white/80 font-bold text-xs transition-colors duration-500 leading-relaxed">إضافة زملاء عمل جدد للمنصة وإدارة أرصدتهم وصلاحياتهم</p>
              </div>
              <i className="fas fa-id-badge absolute -bottom-4 -left-4 text-8xl opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-700 text-black"></i>
            </button>

            <button onClick={() => navigate('/dashboard/reports')} className="w-full group p-6 glass-card hover:bg-emerald-600 transition-all duration-500 text-right overflow-hidden relative">
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 group-hover:bg-white/10 rounded-2xl flex items-center justify-center text-2xl text-purple-700 group-hover:text-white mb-6 shadow-sm transition-colors duration-500">
                  <i className="fas fa-chart-line"></i>
                </div>
                <h4 className="text-xl font-black text-gray-800 group-hover:text-white mb-2 transition-colors duration-500">مركز التقارير</h4>
                <p className="text-gray-500 group-hover:text-white/80 font-bold text-xs transition-colors duration-500 leading-relaxed">تحليل البيانات وإصدار التقارير الإحصائية والمالية لضمان دقة العمل</p>
              </div>
              <i className="fas fa-chart-pie absolute -bottom-4 -left-4 text-8xl opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-700 text-black"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Low Balance Alert Alert */}
      {usersWithLowBalance > 0 && (
        <div className="bg-red-500/10 backdrop-blur-md border-2 border-red-500/20 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-2 h-full bg-red-500 animate-pulse"></div>
          <div className="w-24 h-24 bg-red-500 text-white rounded-[2rem] flex items-center justify-center text-4xl shadow-xl shadow-red-200">
            <i className="fas fa-shield-virus"></i>
          </div>
          <div className="flex-1 text-center md:text-right">
            <h3 className="text-2xl font-black text-red-900 mb-2">تنبيه حرج بالمخزون الزمني</h3>
            <p className="text-red-700/80 font-bold text-sm max-w-2xl">
              تم رصد رصيد منخفض جداً لـ <span className="text-red-600 font-black underline underline-offset-4 decoration-2">{usersWithLowBalance} موظفين</span>. هذا قد يؤثر على سير العمل والمهام القادمة، يرجى المراجعة الفورية.
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard/users')}
            className="px-10 py-5 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 hover:shadow-2xl hover:shadow-red-500/40 transition-all duration-300"
          >
            معالجة الأرصدة
          </button>
        </div>
      )}
    </div>
  );
}

