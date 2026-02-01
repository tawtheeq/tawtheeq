import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

import api from '../api/client';
import { useNavigate } from "react-router-dom";

export default function Missions() {
  const navigate = useNavigate();

  const [missions, setMissions] = useState([]);  // state to hold API data
  const [loading, setLoading] = useState(true);  // loading indicator
  const [error, setError] = useState(null);      // error handling

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const response = await api.get("/api/missions");

        // 👇 Fill the state with the 'data' array from your JSON
        setMissions(response.data.data || response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMissions(); // run the function once on mount
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

  console.log(missions.data)

  const handleDelete = async (id) => {
    if (!id) return;
    const confirmDelete = window.confirm("هل أنت متأكد من حذف المهمة؟");
    if (!confirmDelete) return;

    try {
      console.log("Deleting Mission with id:", id);
      await axios.delete(`/api/missions/${id}`);
      // إزالة العنصر من الجدول بعد نجاح الحذف
      setMissions(prev => prev.filter(c => c.ID !== id));
      alert("تم الحذف بنجاح!");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الحذف: " + err.message);
    }
  };

  const handleAdd = () => {
    // يمكن إضافة توجيه إلى صفحة إضافة مستخدم جديد هنا
    console.log('إضافة مهمة جديد');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">قائمة المهام</h1>
          <p className="text-sm text-gray-500 mt-1">إدارة المهام والمناسبات ({missions.length})</p>
        </div>
        <Link
          to="addmission"
          className="px-4 py-2 bg-dark-green text-white rounded-xl hover:bg-light-green transition-colors flex items-center gap-2"
        >
          <i className="fas fa-plus"></i>
          إضافة مهمة
        </Link>
      </div>

      {/* Missions Table */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">رقم المهمة </th>

                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">اسم المناسبة</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">التاريخ</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">مدة المهمة بالآيام</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">نوع المهمة</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">الحالة</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {missions.length > 0 ? (
                missions.map(mission => (
                  <tr key={mission.ID} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-800">{mission.ID}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-800">{mission.MissionName}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm font-mono">
                      {mission.Day}/{mission.Month}/{mission.Year}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {mission.DurationDays}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{mission.Type == 'internal' ? 'داخلية' : 'خارجية'}</td>
                    <td className="px-6 py-4">
                      {mission.Status === 'completed' && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">مكتملة</span>
                      )}
                      {mission.Status === 'in_progress' && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">قيد التنفيذ</span>
                      )}
                      {mission.Status === 'cancelled' && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">ملغاة</span>
                      )}
                      {mission.Status === 'created' && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-100">تم الإنشاء</span>
                      )}
                      {!['completed', 'in_progress', 'cancelled', 'created'].includes(mission.Status) && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-100">{mission.Status}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                          onClick={() => navigate(`/dashboard/missions/${mission.ID}`)}
                          title="عرض التفاصيل"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors"
                          onClick={() => navigate(`update/${mission.ID}`)}
                          title="تعديل"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-red-600 hover:bg-red-50 transition-colors"
                          onClick={() => handleDelete(mission.ID)}
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
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                        <i className="fas fa-tasks text-2xl"></i>
                      </div>
                      <p className="text-lg font-medium">لا يوجد مهام حالياً</p>
                      <p className="text-sm">قم بإضافة مهمة جديدة للبدء</p>
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
