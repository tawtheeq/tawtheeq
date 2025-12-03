import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import axios from 'axios';

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
        const missionRes = await axios.get(`/api/missions/${id}`);
        setMission(missionRes.data.data);

        console.log(missionRes.data.data);
        const missionDuration = missionRes.data.data.DurationDays;



        console.log(missionDuration);

        // Fetch all users with sufficient balance
        const usersRes = await axios.get(`/api/usersbalance/${missionDuration}`);
        setUsers(usersRes.data.data || []);

        // Fetch existing participants
        const participantsRes = await axios.get(`/api/missions/${id}/participants`);

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
      await axios.post(`/api/missions/${id}/participants`, {
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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إضافة مشاركين للمهمة</h1>
          {mission && (
            <p className="text-gray-500 mt-1">
              {mission.MissionName || 'مهمة'}
            </p>
          )}
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
          onClick={() => navigate(-1)}
        >
          <i className="fas fa-arrow-right"></i>
          <span>عودة للمهمة</span>
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">الاسم</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">رقم الجوال</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">البريد الإلكتروني</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">الدور</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">الرصيد المتبقي</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.length > 0 ? (
                users.map(user => {
                  const isParticipant = existingParticipants.has(user.ID);
                  const isAdding = addingUsers.has(user.ID);
                  const canAdd = canAddUserToMission(user);

                  return (
                    <tr key={user.ID} className={`hover:bg-gray-50/50 transition-colors ${isParticipant ? 'bg-green-50/30' : ''}`}>
                      <td className="px-6 py-4 font-medium text-gray-800">{user.Name}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm font-mono">{user.Mobile || 'غير متوفر'}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{user.Email || 'غير متوفر'}</td>
                      <td className="px-6 py-4 text-gray-600">{user.Role || 'غير محدد'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.Balance > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {user.Balance || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {isParticipant ? (
                          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-green-600 bg-green-50 cursor-default" disabled>
                            <i className="fas fa-check-circle"></i>
                          </button>
                        ) : (
                          <button
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${canAdd
                              ? 'text-white bg-green-800 hover:bg-green-900 shadow-md hover:shadow-lg'
                              : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                              }`}
                            onClick={() => handleAddUserToMission(user)}
                            disabled={!canAdd || isAdding}
                            title={isAdding ? 'جاري الإضافة...' : 'إضافة للمهمة'}
                          >
                            {isAdding ? (
                              <i className="fas fa-spinner fa-spin"></i>
                            ) : (
                              <i className="fas fa-plus"></i>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                        <i className="fas fa-users text-2xl"></i>
                      </div>
                      <p className="text-lg font-medium">لا يوجد مستخدمين متاحين</p>
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

