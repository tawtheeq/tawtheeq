import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/pages/users.scss';
import axios from 'axios';

export default function MissionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [mission, setMission] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch mission details
        const missionRes = await axios.get(`/api/missions/${id}`);
        setMission(missionRes.data.data);

        // Fetch participants
        const participantsRes = await axios.get(`/api/missions/${id}/participants`);
        setParticipants(participantsRes.data.data || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching mission details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleRemoveParticipant = async (participantId) => {
    if (!window.confirm('هل أنت متأكد من إزالة هذا المشارك من المهمة؟')) {
      return;
    }

    try {
      // Note: The route uses {mid} and {pid}, but we'll use the standard format
      // If this doesn't work, the backend route may need to be fixed
      await axios.delete(`/api/missions/${id}/participants/${participantId}`);
      setParticipants(prev => prev.filter(p => p.id !== participantId));
      alert('تم إزالة المشارك بنجاح!');
    } catch (err) {
      console.error('Error removing participant:', err);
      alert(`حدث خطأ أثناء إزالة المشارك: ${err.response?.data?.message || err.message}`);
    }
  };

  const formatDate = (day, month, year) => {
    const months = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    return `${day} ${months[month - 1]} ${year}`;
  };

  if (loading) return <p>Loading mission details...</p>;
  if (error || !mission) return <p>Error: {error || 'Mission not found'}</p>;

  return (
    <div className="users-container">
      <div className="users-header">
        <div>
          <h1>{mission.MissionName}</h1>
          <p style={{ margin: '0.5rem 0 0 0', color: '#64748b', fontSize: '1rem' }}>
            {formatDate(mission.Day, mission.Month, mission.Year)} - مدة المهمة: {mission.DurationDays} يوم
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="function-button"
            onClick={() => navigate(`/dashboard/missions/${id}/add-participants`)}
          >
            <i className="fas fa-user-plus"></i>
            إضافة مشاركين
          </button>
          <button 
            className="function-button"
            onClick={() => navigate(`/dashboard/missions/update/${id}`)}
          >
            <i className="fas fa-edit"></i>
            تعديل
          </button>
          <button 
            className="function-button"
            onClick={() => navigate(-1)}
          >
            <i className="fas fa-arrow-right"></i>
            رجوع
          </button>
        </div>
      </div>

      <div className="users-table" style={{ marginBottom: '2rem' }}>
        <table>
          <thead>
            <tr>
              <th>رقم المنسق</th>
              <th>تمت الإضافة بواسطة</th>
              <th>عدد المشاركين</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{mission.CoordinatorNum || 'غير محدد'}</td>
              <td>{mission.CreatedByName || 'غير محدد'}</td>
              <td>
                <span className={`status ${participants.length > 0 ? 'active' : 'inactive'}`}>
                  {participants.length} مشارك
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="users-header" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem' }}>المشاركون في المهمة</h1>
      </div>

      {participants.length > 0 ? (
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>الاسم</th>
                <th>الدور</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {participants.map(participant => (
                <tr key={participant.id}>
                  <td>{participant.name}</td>
                  <td>{participant.role || 'مشارك'}</td>
                  <td className="user-actions">
                    <button
                      className="procedure-button delete"
                      onClick={() => handleRemoveParticipant(participant.id)}
                      title="إزالة من المهمة"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="users-table">
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <i className="fas fa-user-slash" style={{ fontSize: '4rem', color: '#cbd5e1', marginBottom: '1.5rem', opacity: 0.5 }}></i>
            <p style={{ fontSize: '1.125rem', color: '#64748b', marginBottom: '1.5rem' }}>
              لا يوجد مشاركين في هذه المهمة
            </p>
            <button 
              className="function-button"
              onClick={() => navigate(`/dashboard/missions/${id}/add-participants`)}
            >
              <i className="fas fa-user-plus"></i>
              إضافة مشاركين
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

