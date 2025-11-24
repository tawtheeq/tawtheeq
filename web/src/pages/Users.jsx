
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/users.scss';
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
        setUsers(response.data.data)

      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    };
    fetchUsers();
  }, []);


  // ✅ Handle loading & error states
  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

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
    const confirmDelete = window.confirm("هل أنت متأكد من حذف التصنيف؟");
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

  const handleAdd = () => {
    // يمكن إضافة توجيه إلى صفحة إضافة مستخدم جديد هنا
    console.log('إضافة مستخدم جديد');
  };

  return (
    <div className="users-container">
      <div className="users-header">
        <h1>قائمة المستخدمين</h1>
        <Link to="addemp" className="function-button">
          <i className="fas fa-plus"></i>
          إضافة
        </Link>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>الاسم</th>
              <th> رقم الجوال</th>
              <th>الدور</th>
              <th>الرصيد المتبقي</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map(user => (
                <tr key={user.ID}>
                  <td>{user.Name}</td>
                  <td>{user.Mobile}</td>
                  <td>{user.Role}</td>
                  <td>
                    <span className={`status ${user.Balance > 10 ? 'active' : 'inactive'}`}>
                      {user.Balance}
                    </span>
                  </td>
                  <td className="user-actions">
                    {/* <button className=" procedure-button show">
                      <i className="fas fa-eye"></i>
                    </button> */}
                    <button
                      className="procedure-button edit"
                      onClick={() => navigate(`update/${user.ID}`)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="procedure-button delete"
                      onClick={() => handleDelete(user.ID)}
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


