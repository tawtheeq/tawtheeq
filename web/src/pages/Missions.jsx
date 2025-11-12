
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/missions.scss';
import axios from 'axios';

export default function Missions() {

  // const [users, setUsers] = useState([
  //   {
  //     id: 1,
  //     mission_name: "أحمد محمد",
  //     year: "2025",
  //     location: "مدير",
  //     main_person: "نائب رئيس الأركان",
  //     main_category: "VIP",
  //     status: "نشط"
  //   },
  //   {
  //     id: 2,
  //     mission_name: "محمد محمد",
  //     year: "2015",
  //     location: "مدير",
  //     main_person: "نائب رئيس الأركان",
  //     main_category: "VIP",
  //     status: "نشط"
  //   },
  //   {
  //     id: 3,
  //     mission_name: "خالد محمد",
  //     year: "2020",
  //     location: "مدير",
  //     main_person: "نائب رئيس الأركان",
  //     main_category: "VIP",
  //     status: "نشط"
  //   },
  // ]);


  const [missions, setMissions] = useState([]);  // state to hold API data
  const [loading, setLoading] = useState(true);  // loading indicator
  const [error, setError] = useState(null);      // error handling

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        // 👇 Replace this with your real API URL
        const response = await axios.get("/api/missions");
        
        // 👇 Fill the state with the 'data' array from your JSON
        setMissions(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMissions(); // run the function once on mount
  }, []);

  // ✅ Handle loading & error states
  if (loading) return <p>Loading missions...</p>;
  if (error) return <p>Error: {error}</p>;

  console.log(missions.data)

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
        <Link to="addmission" className="function-button">
          <i className="fas fa-plus"></i>
          إضافة
        </Link>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>اسم المناسبة</th>
              <th>التاريخ </th>
              <th>مدة المهمة</th>
              <th>التصنيف الأساسي</th>
              {/* <th>المنطقة</th> */}
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {missions.length > 0 ? (
              missions.map(mission => (
                <tr key={mission.ID}>
                  <td>{mission.MissionName}</td>
                  <td>{mission.Day}/{mission.Month}/{mission.Year}</td>
                  <td>{mission.DurationDays}</td>
                  <td>{mission.CreatedByName}</td>
                  {/* <td>
                    <span className={`status ${user.status === 'نشط' ? 'active' : 'inactive'}`}>
                      {user.status}
                    </span>
                  </td> */}


                  <td className="user-actions">
                    <button className=" procedure-button show">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="procedure-button edit">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="procedure-button delete"
                      onClick={() => handleDelete(mission.id)}
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



  //   return (
  //   <div className="p-4 grid gap-4">
  //     {missions.map((mission) => (
  //       <div
  //         key={mission.ID}
  //         className="border rounded-xl p-4 shadow-md bg-white"
  //       >
  //         <h2 className="text-xl font-bold">{mission.MissionName}</h2>
  //         <p>Coordinator: {mission.CoordinatorNum}</p>
  //         <p>
  //           Date: {mission.Day}/{mission.Month}/{mission.Year}
  //         </p>
  //         <p>Duration: {mission.DurationDays} days</p>
  //         <p>Created by: {mission.CreatedByName}</p>
  //       </div>
  //     ))}
  //   </div>
  // );
}

  // return (
  //   <ul>

  //   {missions.map((mission)=>{

  //     <li key={mission.id}> {mission.name}</li>
      
  //   })}
    
  //   </ul>
  // );

// }

