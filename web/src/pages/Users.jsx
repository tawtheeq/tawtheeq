import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import api from '../api/client';
import { useNavigate } from "react-router-dom";

export default function Users() {

  const navigate = useNavigate();
  const [users, setUsers] = useState([]);  // state to hold API data
  const [loading, setLoading] = useState(true);  // loading indicator
  const [error, setError] = useState(null);      // error handling

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/api/users")
        setUsers(response.data.data || response.data)

      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    };
    fetchUsers();
  }, []);


  // ✅ Handle loading & error states
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

  // const [users, setUsers] = useState([
  //   {
  //     id: 1,
  //     name: "أحمد محمد",
  //     email: "ahmed@example.com",
  //     role: "مدير",
  //     department: "قسم التوثيق",
  //     status: 0
  //   },
  //   {
  //     id: 2,
  //     name: "سارة أحمد",
  //     email: "sara@example.com",
  //     role: "محرر",
  //     department: "قسم الإعلام",
  //     status: 20
  //   },
  //   {
  //     id: 3,
  //     name: "محمد علي",
  //     email: "mohammad@example.com",
  //     role: "مصور",
  //     department: "قسم المتابعة",
  //     status: 45
  //   }
  // ]);

  const handleDelete = async (id) => {
    if (!id) return;
    const confirmDelete = window.confirm("هل أنت متأكد من حذف الموظف؟");
    if (!confirmDelete) return;

    try {
      console.log("Deleting User with id:", id);
      await api.delete(`/api/users/${id}`);
      // إزالة العنصر من الجدول بعد نجاح الحذف
      setUsers(prev => prev.filter(c => c.ID !== id));
      alert("تم الحذف بنجاح!");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الحذف: " + err.message);
    }
  };

  const handleToggleNegativeBalance = async (userId, currentStatus) => {
    try {
      const action = currentStatus === 'yes' ? 'disallow' : 'allow';
      const confirmMessage = currentStatus === 'yes'
        ? 'هل تريد إزالة الاستثناء من هذا الموظف'
        : 'هل تريد إضافة الاستثناء لهذا الموظف؟';

      if (!window.confirm(confirmMessage)) return;

      if (action === 'allow') {
        await api.post(`/api/users/${userId}/allow-negative-balance`);
      } else {
        await api.post(`/api/users/${userId}/disallow-negative-balance`);
      }

      // Update local state
      setUsers(prev => prev.map(user =>
        user.ID === userId
          ? { ...user, NegativeBalance: currentStatus === 'yes' ? 'no' : 'yes' }
          : user
      ));

      alert('تم تحديث الإعدادات بنجاح!');
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء التحديث: ' + err.message);
    }
  };

  const handleAdd = () => {
    // يمكن إضافة توجيه إلى صفحة إضافة مستخدم جديد هنا
    console.log('إضافة مستخدم جديد');
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
              <h1 className="text-3xl font-black tracking-tight text-gray-800">إدارة الموظفين</h1>
            </div>
            <p className="text-gray-500 font-bold pr-4">إدارة بيانات الزملاء، صلاحياتهم، وأرصدة المهام</p>
          </div>
        </div>

        <Link
          to="addemp"
          className="px-8 py-4 premium-gradient text-white font-black rounded-2xl hover:shadow-2xl hover:shadow-green-900/40 transition-all duration-300 flex items-center gap-3 active:scale-[0.98]"
        >
          <i className="fas fa-plus"></i>
          <span>إضافة موظف جديد</span>
        </Link>
      </div>

      {/* Users List Container */}
      <div className="space-y-4">
        {/* Table Header - Custom Hidden on Mobile */}
        <div className="hidden lg:grid grid-cols-12 gap-4 px-10 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">
          <div className="col-span-4">الموظف</div>
          <div className="col-span-2">الوظيفة</div>
          <div className="col-span-2">الرصيد</div>
          <div className="col-span-2">الحالة</div>
          <div className="col-span-2 text-left">الإجراءات</div>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {users.length > 0 ? (
            users.map(user => (
              <div key={user.ID} className="glass-card p-6 lg:p-4 group hover:bg-white transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 border-white/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1 h-full bg-dark-green opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-center px-4">
                  {/* User Info */}
                  <div className="col-span-4 flex items-center gap-5">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-dark-green font-black text-xl border-2 border-white shadow-sm group-hover:scale-110 transition-transform duration-500">
                        {user.Name.charAt(0)}
                      </div>
                      <div className={`absolute -bottom-1 -left-1 w-5 h-5 rounded-full border-4 border-white ${user.IsActive ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-black text-gray-800 text-lg group-hover:text-dark-green transition-colors truncate">{user.Name}</h3>
                      <p className="text-xs font-bold text-gray-400 font-mono mt-0.5">{user.Mobile}</p>
                    </div>
                  </div>

                  {/* Job */}
                  <div className="col-span-2">
                    <div className="flex flex-col">
                      <span className="lg:hidden text-[10px] font-black text-gray-300 uppercase mb-1">الوظيفة</span>
                      <span className="inline-flex px-4 py-1.5 rounded-xl text-xs font-black bg-blue-50/50 text-blue-700 border border-blue-100/50 w-fit">
                        {user.Job === 'photo' ? 'مصور فوتو' : user.Job === 'video' ? 'مصور فيديو' : user.Job}
                      </span>
                    </div>
                  </div>

                  {/* Balance */}
                  <div className="col-span-2">
                    <div className="flex flex-col">
                      <span className="lg:hidden text-[10px] font-black text-gray-300 uppercase mb-1">رصيد المهام</span>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 max-w-[80px] h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${user.Balance > 20 ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.min(100, (user.Balance / 60) * 100)}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-black ${user.Balance > 20 ? 'text-green-600' : 'text-red-600'}`}>
                          {user.Balance}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Exceptions */}
                  <div className="col-span-2 flex flex-col lg:flex-row gap-3">
                    <div className="flex flex-col">
                      <span className="lg:hidden text-[10px] font-black text-gray-300 uppercase mb-1">الحالة</span>
                      <button
                        onClick={() => handleToggleNegativeBalance(user.ID, user.NegativeBalance)}
                        className={`px-4 py-1.5 rounded-xl text-[10px] font-black border transition-all flex items-center gap-2 w-fit ${user.NegativeBalance === 'yes'
                          ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                          : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                          }`}
                      >
                        <i className={`fas ${user.NegativeBalance === 'yes' ? 'fa-star' : 'fa-circle'}`}></i>
                        {user.NegativeBalance === 'yes' ? 'مستثنى' : 'عادي'}
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex justify-end gap-2">
                    {!user.IsActive && user.InvitationToken?.String && (
                      <button
                        onClick={() => {
                          const link = `${window.location.origin}/activate/${user.InvitationToken.String}`;
                          navigator.clipboard.writeText(link);
                          alert("تم نسخ رابط التفعيل!");
                        }}
                        className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white transition-all duration-300 shadow-sm flex items-center justify-center group/btn"
                        title="نسخ رابط التفعيل"
                      >
                        <i className="fas fa-link group-hover/btn:rotate-45 transition-transform duration-500"></i>
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`${user.ID}/report`)}
                      className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all duration-300 shadow-sm flex items-center justify-center"
                      title="عرض التقرير"
                    >
                      <i className="fas fa-file-invoice"></i>
                    </button>
                    <button
                      onClick={() => navigate(`update/${user.ID}`)}
                      className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-sm flex items-center justify-center"
                      title="تعديل"
                    >
                      <i className="fas fa-user-edit text-sm"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(user.ID)}
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
                <i className="fas fa-users"></i>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-800">قائمة فارغة</h3>
                <p className="text-gray-400 font-bold max-w-xs mx-auto">لم يتم تسجيل أي موظف حتى الآن، ابدأ بإضافة الزملاء لبناء فريق العمل</p>
              </div>
              <Link to="addemp" className="px-8 py-3 bg-dark-green text-white font-black rounded-2xl shadow-lg shadow-green-900/10 hover:shadow-2xl transition-all">إضافة أول موظف</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



