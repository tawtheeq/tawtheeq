import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import api from '../api/client';

export default function AddParticipantsToMission() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [mission, setMission] = useState(null);
  const [existingParticipants, setExistingParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingUsers, setAddingUsers] = useState(new Set()); // Track which users are being added

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch mission details
        const missionRes = await api.get(`/api/missions/${id}`);
        setMission(missionRes.data.data);

        console.log(missionRes.data.data);
        const missionDuration = missionRes.data.data.DurationDays;


        console.log(missionDuration);

        // Fetch all users
        const usersRes = await api.get(`/api/users`);
        setUsers(usersRes.data.data || []);

        // Fetch existing participants
        const participantsRes = await api.get(`/api/missions/${id}/participants`);

        // Handle empty or undefined participants response
        const participantsData = participantsRes.data?.data;
        if (participantsData && Array.isArray(participantsData) && participantsData.length > 0) {
          const participantIds = participantsData.map(p => p.id || p.ID);
          setExistingParticipants(new Set(participantIds));
        } else {
          // No participants yet - initialize with empty Set
          setExistingParticipants(new Set());
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Placeholder function for conditions - to be implemented later
  const canAddUserToMission = (user) => {
    return !existingParticipants.has(user.ID);
  };

  const handleAddUserToMission = async (user) => {
    if (!canAddUserToMission(user)) {
      alert('المستخدم موجود بالفعل في المهمة');
      return;
    }

    setAddingUsers(prev => new Set(prev).add(user.ID));

    try {
      await api.post(`/api/missions/${id}/participants`, {
        MissionID: parseInt(id),
        UserID: user.ID,
        Role: user.Role || 'مشارك' // Default role
      });

      // Update existing participants
      setExistingParticipants(prev => new Set(prev).add(user.ID));
      alert(`تم إضافة ${user.Name} إلى المهمة بنجاح!`);
    } catch (err) {
      console.error('Error adding participant:', err);
      alert(`حدث خطأ أثناء إضافة ${user.Name}: ${err.response?.data?.message || err.message}`);
    } finally {
      setAddingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(user.ID);
        return newSet;
      });
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

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
              <h1 className="text-3xl font-black tracking-tight text-gray-800 uppercase">إسناد فريق العمل</h1>
            </div>
            {mission && (
              <p className="text-gray-500 font-bold pr-4">إضافة مشاركين لمهمة: <span className="text-dark-green font-black">{mission.MissionName}</span></p>
            )}
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-white/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
              <i className="fas fa-users"></i>
            </div>
            <h2 className="text-2xl font-black text-gray-800">قائمة الموظفين المتاحين</h2>
          </div>
          <div className="text-xs font-black text-gray-400 uppercase tracking-widest bg-slate-100 px-4 py-2 rounded-full">
            إجمالي الصفوف: {users.length}
          </div>
        </div>

        <div className="p-4 space-y-2">
          {users.length > 0 ? (
            users.map(user => {
              const isParticipant = existingParticipants.has(user.ID);
              const isAdding = addingUsers.has(user.ID);

              return (
                <div
                  key={user.ID}
                  className={`flex flex-col md:flex-row md:items-center justify-between p-6 rounded-[2rem] transition-all duration-300 border-2 ${isParticipant
                      ? 'bg-green-50/20 border-green-100 opacity-60'
                      : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100 group'
                    }`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shadow-sm border-2 transition-all ${isParticipant ? 'bg-green-500 text-white border-green-400' : 'bg-white text-dark-green border-slate-100 group-hover:scale-110'
                      }`}>
                      {user.Name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-black text-gray-800 text-lg">{user.Name}</h4>
                      <div className="flex flex-wrap items-center gap-4 mt-1 text-[10px] font-bold text-gray-400">
                        <span className="flex items-center gap-1">
                          <i className="fas fa-id-badge opacity-50"></i>
                          {user.Job === 'photo' ? 'مصور فوتو' : user.Job === 'video' ? 'مصور فيديو' : user.Job === 'reporter' ? 'مراسل' : user.Job || 'عضو فريق'}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                        <span className="font-mono tracking-tight">{user.Mobile}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                        <span className={`px-2 py-0.5 rounded-lg ${user.Balance > 10 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                          الرصيد: {user.Balance} يوم
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4 md:mt-0 ltr:flex-row-reverse rtl:flex-row">
                    {isParticipant ? (
                      <div className="flex items-center gap-2 px-6 py-3 bg-green-50 text-green-600 rounded-2xl font-black text-sm">
                        <i className="fas fa-check-circle"></i>
                        <span>تمت الإضافة</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddUserToMission(user)}
                        disabled={isAdding}
                        className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm flex items-center gap-3 hover:bg-dark-green transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isAdding ? (
                          <>
                            <i className="fas fa-spinner fa-spin"></i>
                            <span>جاري التنفيذ..</span>
                          </>
                        ) : (
                          <>
                            <i className="fas fa-plus"></i>
                            <span>إضافة للمهمة</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-24 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-5xl text-slate-200">
                <i className="fas fa-user-slash"></i>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-gray-800">لا يوجد موظفين متاحين</h3>
                <p className="text-sm font-bold text-gray-400 max-w-xs mx-auto">لم يتم العثور على أي موظفين مسجلين في النظام ليتم إسنادهم.</p>
              </div>
              <button
                onClick={() => navigate('/dashboard/users/add')}
                className="px-8 py-3 bg-dark-green text-white rounded-2xl font-black shadow-lg shadow-green-900/20 active:scale-95 transition-transform"
              >
                تسجيل موظف جديد
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


