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
      await api.delete(`/api/missions/${id}`);
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
              <h1 className="text-3xl font-black tracking-tight text-gray-800">قائمة المهام</h1>
            </div>
            <p className="text-gray-500 font-bold pr-4">إدارة وتتبع المهام الإعلامية والمناسبات القائمة</p>
          </div>
        </div>

        <Link
          to="addmission"
          className="px-8 py-4 premium-gradient text-white font-black rounded-2xl hover:shadow-2xl hover:shadow-green-900/40 transition-all duration-300 flex items-center gap-3 active:scale-[0.98]"
        >
          <i className="fas fa-plus"></i>
          <span>إنشاء مهمة جديدة</span>
        </Link>
      </div>

      {/* Missions List Container */}
      <div className="space-y-4">
        {/* Table Header */}
        <div className="hidden lg:grid grid-cols-12 gap-4 px-10 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">
          <div className="col-span-1">ID</div>
          <div className="col-span-4">اسم المهمة والمناسبة</div>
          <div className="col-span-2">التاريخ</div>
          <div className="col-span-1">المدة</div>
          <div className="col-span-2">الحالة</div>
          <div className="col-span-2 text-left">الإجراءات</div>
        </div>

        {/* Missions List */}
        <div className="space-y-4">
          {missions.length > 0 ? (
            missions.map(mission => (
              <div key={mission.ID} className="glass-card p-6 lg:p-4 group hover:bg-white transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 border-white/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1 h-full bg-dark-green opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-center px-4">
                  {/* ID */}
                  <div className="col-span-1">
                    <span className="text-xs font-black text-gray-300 font-mono">#{mission.ID}</span>
                  </div>

                  {/* Mission Name */}
                  <div className="col-span-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm ${mission.Type === 'external' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                        <i className={`fas ${mission.Type === 'external' ? 'fa-globe-americas' : 'fa-building'}`}></i>
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="font-black text-gray-800 text-lg group-hover:text-dark-green transition-colors truncate">{mission.MissionName}</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{mission.Type === 'external' ? 'مهمة خارجية' : 'مهمة داخلية'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="col-span-2">
                    <div className="flex flex-col">
                      <span className="lg:hidden text-[10px] font-black text-gray-300 uppercase mb-1">التاريخ</span>
                      <div className="flex items-center gap-2 text-gray-600">
                        <i className="far fa-calendar-alt text-dark-green/40"></i>
                        <span className="text-sm font-black font-mono">{mission.Day}/{mission.Month}/{mission.Year}</span>
                      </div>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="col-span-1">
                    <div className="flex flex-col">
                      <span className="lg:hidden text-[10px] font-black text-gray-300 uppercase mb-1">المدة</span>
                      <span className="text-sm font-black text-gray-800">{mission.DurationDays} أيام</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <div className="flex flex-col">
                      <span className="lg:hidden text-[10px] font-black text-gray-300 uppercase mb-1">الحالة</span>
                      {mission.Status === 'completed' ? (
                        <span className="inline-flex px-4 py-1.5 rounded-xl text-[10px] font-black bg-green-50/50 text-green-700 border border-green-100/50 w-fit items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          مكتملة
                        </span>
                      ) : mission.Status === 'in_progress' ? (
                        <span className="inline-flex px-4 py-1.5 rounded-xl text-[10px] font-black bg-blue-50/50 text-blue-700 border border-blue-100/50 w-fit items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                          قيد التنفيذ
                        </span>
                      ) : mission.Status === 'cancelled' ? (
                        <span className="inline-flex px-4 py-1.5 rounded-xl text-[10px] font-black bg-red-50/50 text-red-700 border border-red-100/50 w-fit items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                          ملغاة
                        </span>
                      ) : (
                        <span className="inline-flex px-4 py-1.5 rounded-xl text-[10px] font-black bg-gray-50/50 text-gray-700 border border-gray-100/50 w-fit items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                          تم الإنشاء
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex justify-end gap-2">
                    <button
                      onClick={() => navigate(`/dashboard/missions/${mission.ID}`)}
                      className="w-11 h-11 rounded-2xl bg-slate-50 text-slate-600 hover:bg-dark-green hover:text-white transition-all duration-300 shadow-sm flex items-center justify-center group/btn"
                      title="عرض التفاصيل"
                    >
                      <i className="fas fa-eye group-hover/btn:scale-110 transition-transform"></i>
                    </button>
                    <button
                      onClick={() => navigate(`update/${mission.ID}`)}
                      className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-sm flex items-center justify-center"
                      title="تعديل"
                    >
                      <i className="fas fa-edit text-sm"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(mission.ID)}
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
                <i className="fas fa-tasks"></i>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-800">قائمة المهام فارغة</h3>
                <p className="text-gray-400 font-bold max-w-xs mx-auto">لم يتم تسجيل أي مهمة إعلامية حتى الآن، ابدأ بتنظيم مهام الفريق</p>
              </div>
              <Link to="addmission" className="px-8 py-3 bg-dark-green text-white font-black rounded-2xl shadow-lg shadow-green-900/10 hover:shadow-2xl transition-all">إنشاء أول مهمة</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

