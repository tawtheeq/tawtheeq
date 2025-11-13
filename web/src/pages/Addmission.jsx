import { useEffect, useState } from 'react';
import '../styles/pages/missions.scss';
import { use } from 'react';
import { useActionData } from 'react-router-dom';
import axios from 'axios';

export default function Addmission() {

    const [mainCategories, setMainCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedMain, setSelectedMain] = useState("");
    const [selectedSub, setSelectedSub] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        MissionName: '',
        CoordinatorNum:'',
        MainCategory: '',
        SubCategory: '',
        Day:'',
        Month: '',
        Year: '',
        DurationDays: '',
        CreatedBy:'',
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const [mainRes, subRes] = await Promise.all([
                    axios.get("/api/maincategories"),
                    axios.get("/api/subcategories"),
                ]);

                setMainCategories(mainRes.data.data || []);
                setSubCategories(subRes.data.data || []);
            } catch (err) {
                setError(err.message);
                alert(err.message)
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) return <p>Loading categories...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;





    // const photographers = [
    //     { id: 1, name: 'أحمد', delegationBalance: 5, leaves: [{ from: '2025-08-14', to: '2025-09-23' }] },
    //     { id: 2, name: 'سارة', delegationBalance: 0, leaves: [] },
    //     { id: 3, name: 'خالد', delegationBalance: 3, leaves: [{ from: '2025-08-14', to: '2025-09-01' }] },
    //     { id: 4, name: 'مريم', delegationBalance: 2, leaves: [] },
    //     { id: 5, name: 'يوسف', delegationBalance: 1, leaves: [{ from: '2025-09-10', to: '2025-09-15' }] },
    // ];


    // const taskStart = '2025-09-13';
    // const taskEnd = '2025-09-20';



    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // try {
        //     const response = await axios.post("/api/missions", {
        //         name,
        //         mobile,
        //         email,
        //     });

        //     console.log("Server response:", response.data);
        //     alert("Data submitted successfully!");
        // } catch (error) {
        //     console.error("Error submitting data:", error);
        //     alert("Error occurred while submitting data!");
        // }
    };

    return (
        <div className="users-container">
            <div className="users-header">
                <h1>إضافة</h1>
            </div>
            <form className="input-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label>اسم المهمة</label>
                        <input
                            type="text"
                            name="mission_name"
                            value={form.MissionName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label> رقم المنسق</label>
                        <input
                            type="text"
                            name="mission_name"
                            value={form.CoordinatorNum}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>السنة</label>
                        <input
                            type="number"
                            name="year"
                            value={form.Year}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>الشهر</label>
                        <input
                            type="number"
                            name="year"
                            value={form.Month}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>اليوم</label>
                        <input
                            type="number"
                            name="year"
                            value={form.Day}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>التصنيف الرئيسي</label>
                        <select
                            type="text"
                            name="main_category"
                            value={form.MainCategory}
                            onChange={handleChange}
                            required
                        >
                            <option value="">- اختر تصنيفًا -</option>
                            {mainCategories.map((mainCat)=>(
                                <option key={mainCat.ID} value={mainCat.ID}>
                                    {mainCat.CategoryName}
                                    </option>
                            ))}
                       
                        </select>
                    </div>
                    <div className="form-group">
                        <label>التصنيف الفرعي</label>
                        <select
                            name="status"
                            value={form.SubCategory}
                            onChange={handleChange}
                            required
                        >
                            <option value="">- اختر تصنيفًا -</option>
                            {subCategories.map((subCat)=>(
                                <option key={subCat.ID} value={subCat.ID}>
                                    {subCat.CategoryName}
                                </option>
                            ))}
                           
                        </select>
                    </div>
                </div>



                <div className="form-row">

                    <div className="form-group">
                        <label>الوصف</label>
                        <input
                            type="text"
                            name="main_category"
                            value={form.main_category}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="function-button">
                    <i className="fas fa-plus"></i> إضافة المهمة
                </button>
            </form>
        </div>
    );
}
