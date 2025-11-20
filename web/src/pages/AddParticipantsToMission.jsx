import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/pages/users.scss';
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

        // Fetch all users
        const usersRes = await axios.get('/api/users');
        setUsers(usersRes.data.data);

        // Fetch existing participants
        const participantsRes = await axios.get(`/api/missions/${id}/participants`);
        const participantIds = participantsRes.data.data.map(p => p.id);
        setExistingParticipants(new Set(participantIds));
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
    // TODO: Add conditions here (e.g., balance check, leave conflicts, etc.)
    // For now, just check if user is already a participant
    return !existingParticipants.has(user.ID);
  };

  const handleAddUserToMission = async (user) => {
    if (!canAddUserToMission(user)) {
      alert('لا يمكن إضافة هذا المستخدم (سيتم تحديد الشروط لاحقاً)');
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
    <div className="users-container">
      <div className="users-header">
        <div>
          <h1>إضافة مشاركين للمهمة</h1>
          {mission && (
            <p style={{ margin: '0.5rem 0 0 0', color: '#64748b', fontSize: '1rem' }}>
              {mission.MissionName || 'مهمة'}
            </p>
          )}
        </div>
        <button 
          className="function-button"
          onClick={() => navigate(-1)}
        >
          <i className="fas fa-arrow-right"></i>
          رجوع
        </button>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>الاسم</th>
              <th>رقم الجوال</th>
              <th>البريد الإلكتروني</th>
              <th>الدور</th>
              <th>الرصيد المتبقي</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map(user => {
                const isParticipant = existingParticipants.has(user.ID);
                const isAdding = addingUsers.has(user.ID);
                const canAdd = canAddUserToMission(user);

                return (
                  <tr key={user.ID} className={isParticipant ? 'participant-row' : ''}>
                    <td>{user.Name}</td>
                    <td>{user.Mobile || 'غير متوفر'}</td>
                    <td>{user.Email || 'غير متوفر'}</td>
                    <td>{user.Role || 'غير محدد'}</td>
                    <td>
                      <span className={`status ${user.Balance > 10 ? 'active' : 'inactive'}`}>
                        {user.Balance || 0}
                      </span>
                    </td>
                    <td className="user-actions">
                      {isParticipant ? (
                        <button className="procedure-button show" disabled>
                          <i className="fas fa-check-circle"></i>
                        </button>
                      ) : (
                        <button
                          className={`procedure-button ${canAdd ? 'edit' : 'delete'}`}
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
                <td colSpan="6" className="empty-state">
                  <i className="fas fa-users"></i>
                  <p>لا يوجد مستخدمين متاحين</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

