
import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/missions.scss';

export default function Missions() {
  const [users, setUsers] = useState([
    {
      id: 1,
      mission_name: "أحمد محمد",
      year: "2025",
      location: "مدير",
      main_person: "نائب رئيس الأركان",
      main_category:"VIP",
      status: "نشط"
    },
       {
      id: 2,
      mission_name: "محمد محمد",
      year: "2015",
      location: "مدير",
      main_person: "نائب رئيس الأركان",
      main_category:"VIP",
      status: "نشط"
    },
       {
      id: 3,
      mission_name: "خالد محمد",
      year: "2020",
      location: "مدير",
      main_person: "نائب رئيس الأركان",
      main_category:"VIP",
      status: "نشط"
    },
  ]);

  const handleDelete = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const handleAdd = () => {
    // يمكن إضافة توجيه إلى صفحة إضافة مستخدم جديد هنا
    console.log('إضافة مهمة جديد');

  };

  return (
    <div className="users-container">
      <div className="users-header">
        <h1>قائمة المهام</h1>
        <Link to="addmission" className="add-user-btn">
  <i className="fas fa-plus"></i>
  إضافة مهمة
</Link>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>المناسبة</th>
              <th>التاريخ </th>
              <th>الممثل الرئيسي</th>
              <th>التصنيف الأساسي</th>
              {/* <th>المنطقة</th> */}
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map(user => (
                <tr key={user.id}>
                  <td>{user.mission_name}</td>
                  <td>{user.year}</td>
                  <td>{user.main_person}</td>
                  <td>{user.main_category}</td>
                  {/* <td>
                    <span className={`status ${user.status === 'نشط' ? 'active' : 'inactive'}`}>
                      {user.status}
                    </span>
                  </td> */}
                  <td className="user-actions">
                     <button className=" procedure-button">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className=" procedure-button">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className=" procedure-button"
                      onClick={() => handleDelete(user.id)}
                    >
                      <i className="fas fa-trash"></i>
                      
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="empty-state">
                  <i className="fas fa-users"></i>
                  <p>لا يوجد مستخدمين حالياً</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


