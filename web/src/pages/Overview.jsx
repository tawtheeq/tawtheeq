import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
          axios.get('/api/missions'),
          axios.get('/api/users')
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
      title: 'إجمالي المستخدمين',
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
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">لوحة المعلومات</h1>
        <p className="text-sm text-gray-500 mt-1">نظرة عامة على النظام والإحصائيات</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                stat.color === 'green' ? 'bg-green-50 text-green-600' :
                  stat.color === 'yellow' ? 'bg-yellow-50 text-yellow-600' :
                    'bg-red-50 text-red-600'
                }`}>
                <i className={`${stat.icon} text-xl`}></i>
              </div>
              <span className="text-sm font-medium text-gray-500">{stat.change}</span>
            </div>
            <div className="text-sm font-medium text-gray-500 mb-1">{stat.title}</div>
            <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ongoing Missions */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <i className="fas fa-calendar-check text-green-700"></i>
              المهام الجارية ({ongoingMissions.length})
            </h2>
          </div>
          <div className="p-6">
            {ongoingMissions.length > 0 ? (
              <div className="space-y-4">
                {ongoingMissions.map((mission) => (
                  <div
                    key={mission.ID}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/dashboard/missions/${mission.ID}`)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">{mission.MissionName}</h3>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        جارية
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <i className="fas fa-calendar text-gray-400"></i>
                        {formatDate(mission.Day, mission.Month, mission.Year)}
                      </div>
                      <div className="flex items-center gap-2">
                        <i className="fas fa-clock text-gray-400"></i>
                        {mission.DurationDays} يوم
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <i className="fas fa-inbox text-4xl mb-2"></i>
                <p>لا توجد مهام جارية حالياً</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Missions */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <i className="fas fa-history text-blue-700"></i>
              المهام الأخيرة
            </h2>
          </div>
          <div className="p-6">
            {recentMissions.length > 0 ? (
              <div className="space-y-4">
                {recentMissions.map((mission) => (
                  <div
                    key={mission.ID}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/dashboard/missions/${mission.ID}`)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">{mission.MissionName}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${mission.Type === 'external'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                        }`}>
                        {mission.Type === 'external' ? 'خارجية' : 'داخلية'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <i className="fas fa-calendar text-gray-400"></i>
                        {formatDate(mission.Day, mission.Month, mission.Year)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <i className="fas fa-inbox text-4xl mb-2"></i>
                <p>لا توجد مهام هذا الشهر</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Users with Low Balance Alert */}
      {usersWithLowBalance > 0 && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-red-800 mb-2">تنبيه: رصيد منخفض</h3>
              <p className="text-red-700 text-sm mb-3">
                يوجد {usersWithLowBalance} مستخدم برصيد أقل من 20 يوم. يرجى مراجعة الأرصدة وتحديثها.
              </p>
              <button
                onClick={() => navigate('/dashboard/users')}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded-xl hover:bg-red-700 transition-colors"
              >
                عرض المستخدمين
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/dashboard/missions/addmission')}
          className="p-6 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl hover:shadow-lg transition-all text-right group"
        >
          <div className="flex items-center justify-between mb-3">
            <i className="fas fa-plus-circle text-3xl text-green-700 group-hover:scale-110 transition-transform"></i>
            <i className="fas fa-arrow-left text-green-700"></i>
          </div>
          <h3 className="font-bold text-gray-800 mb-1">إضافة مهمة جديدة</h3>
          <p className="text-sm text-gray-600">إنشاء مهمة جديدة وإضافة المشاركين</p>
        </button>

        <button
          onClick={() => navigate('/dashboard/users/addemp')}
          className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl hover:shadow-lg transition-all text-right group"
        >
          <div className="flex items-center justify-between mb-3">
            <i className="fas fa-user-plus text-3xl text-blue-700 group-hover:scale-110 transition-transform"></i>
            <i className="fas fa-arrow-left text-blue-700"></i>
          </div>
          <h3 className="font-bold text-gray-800 mb-1">إضافة مستخدم جديد</h3>
          <p className="text-sm text-gray-600">تسجيل موظف جديد في النظام</p>
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
    </div>
  );
}
