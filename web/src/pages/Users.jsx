
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function Users() {

  const navigate = useNavigate();
  const [users, setUsers] = useState([]);  // state to hold API data
  const [loading, setLoading] = useState(true);  // loading indicator
  const [error, setError] = useState(null);      // error handling

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users")
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
      await axios.delete(`/api/users/${id}`);
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
        await axios.post(`/api/users/${userId}/allow-negative-balance`);
      } else {
        await axios.post(`/api/users/${userId}/disallow-negative-balance`);
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
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">قائمة المستخدمين</h1>
          <p className="text-sm text-gray-500 mt-1">إدارة المستخدمين وصلاحياتهم ({users.length})</p>
        </div>
        <Link
          to="addemp"
          className="px-4 py-2 bg-dark-green text-white rounded-xl hover:bg-light-green transition-colors flex items-center gap-2"
        >
          <i className="fas fa-plus"></i>
          إضافة مستخدم
        </Link>
      </div>

      {/* Users Table */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">الاسم</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">رقم الجوال</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">الوظيفة</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">الرصيد المتبقي</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600"> الاستثناءات</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.length > 0 ? (
                users.map(user => (
                  <tr key={user.ID} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm border border-green-200">
                          {user.Name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-800">{user.Name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-sm">{user.Mobile}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {user.Job == 'photo' ? 'مصور فوتو' : user.Job == 'video' ? 'مصور فيديو' : user.job}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${user.Balance > 10
                        ? 'bg-green-50 text-green-700 border-green-100'
                        : 'bg-red-50 text-red-700 border-red-100'
                        }`}>
                        {user.Balance}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleNegativeBalance(user.ID, user.NegativeBalance)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${user.NegativeBalance === 'yes'
                          ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                          }`}
                        title={user.NegativeBalance === 'yes' ? 'مستثنى' : 'غير مستثنى'}
                      >
                        {user.NegativeBalance === 'yes' ? (
                          <>
                            <i className="fas fa-check-circle ml-1"></i>
                            مستثنى
                          </>
                        ) : (
                          <>
                            <i className="fas fa-times-circle ml-1"></i>
                            غير مستثنى
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-green-600 hover:bg-green-50 transition-colors"
                          onClick={() => navigate(`${user.ID}/report`)}
                          title="عرض التقرير"
                        >
                          <i className="fas fa-file-alt"></i>
                        </button>
                        <button
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors"
                          onClick={() => navigate(`update/${user.ID}`)}
                          title="تعديل"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-red-600 hover:bg-red-50 transition-colors"
                          onClick={() => handleDelete(user.ID)}
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
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                        <i className="fas fa-users text-2xl"></i>
                      </div>
                      <p className="text-lg font-medium">لا يوجد مستخدمين حالياً</p>
                      <p className="text-sm">قم بإضافة مستخدم جديد للبدء</p>
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


