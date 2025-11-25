import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/missions.scss';
import axios from 'axios';

export default function Categories() {

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        // تأكد أن الـ API ترجع data داخل response.data.data
        setCategories(response.data.data || response.data);
      } catch (err) {
        setError(err.message);
        console.error(err);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleDelete = async (id) => {
    if (!id) return;
    const confirmDelete = window.confirm("هل أنت متأكد من حذف التصنيف؟");
    if (!confirmDelete) return;

    try {
      console.log("Deleting category with id:", id);
      await axios.delete(`/api/categories/${id}`);
      // إزالة العنصر من الجدول بعد نجاح الحذف
      setCategories(prev => prev.filter(c => c.ID !== id));
      alert("تم الحذف بنجاح!");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الحذف: " + err.message);
    }
  };

  const handleAdd = () => {
    console.log('إضافة تصنيف جديد');
  };

  return (
    <div className="users-container">
      <div className="users-header">
        <h1>التصنيفات</h1>
        <Link to="addcategory" className="function-button">
          <i className="fas fa-plus"></i> إضافة
        </Link>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>اسم التصنيف</th>
              <th>النوع</th>
              <th>مختصر الوصف</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map(category => (
                <tr key={category.ID}>
                  <td>{category.CategoryName}</td>
                  <td>
                    <span className={`status ${category.CategoryType === 'main' ? 'active' : 'inactive'}`}>
                      {category.CategoryType}
                    </span>
                  </td>
                  <td>{category.Description}</td>
                  <td className="user-actions">
                    <button className="procedure-button edit">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="procedure-button delete"
                      onClick={() => handleDelete(category.ID)}
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
                  <p>لا يوجد تصنيفات حالياً</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
