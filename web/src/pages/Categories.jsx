
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/missions.scss';
import axios from 'axios';

export default function Categories() {


  const [categories, setCategories] = useState([]);  // state to hold API data
  const [loading, setLoading] = useState(true);  // loading indicator
  const [error, setError] = useState(null);      // error handling

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // 👇 Replace this with your real API URL
        const response = await axios.get("/api/categories");
        
        // 👇 Fill the state with the 'data' array from your JSON
        setCategories(response.data.data);
      } catch (err) {
        setError(err.message);
        alert(err.message)
      } finally {
        setLoading(false);
      }
    };

    fetchCategories(); // run the function once on mount
  }, []);

  // ✅ Handle loading & error states
  if (loading) return <p>Loading missions...</p>;
  if (error) return <p>Error: {error}</p>;

  // console.log(missions.data)

  const handleDelete = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا التصيف؟')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const handleAdd = () => {
    // يمكن إضافة توجيه إلى صفحة إضافة مستخدم جديد هنا
    console.log('إضافة تصنيف جديد');

  };

  return (
    <div className="users-container">
      <div className="users-header">
        <h1> التصنيفات</h1>
        <Link to="addcategory" className="function-button">
          <i className="fas fa-plus"></i>
          إضافة
        </Link>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>اسم التصنيف</th>
              <th>النوع </th>
              <th>مختصر الوصف</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map(category => (
                <tr key={category.id}>
                  <td>{category.CategoryName}</td>
                    <td>
                    <span className={`status ${category.CategoryType === 'main' ? 'active' : 'inactive'}`}>
                      {category.CategoryType}
                    </span>
                  </td>
                  <td>{category.Description}</td>
                


                  <td className="user-actions">
                    <button className=" procedure-button show">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="procedure-button edit">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="procedure-button delete"
                      // onClick={() => handleDelete(category.ID)}
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


