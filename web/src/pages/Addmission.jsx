import { useEffect, useState } from 'react';
import '../styles/pages/missions.scss';
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
        CoordinatorNum: '',
        MainCategory: '',
        SubCategory: '',
        Day: '',
        Month: '',
        Year: '',
        DurationDays: '',
        CreatedBy: '',
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



    const numericFields = ["CoordinatorNum", "MainCategory", "SubCategory", "Year", "Month", "Day", "DurationDays", "CreatedBy"];

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: numericFields.includes(name) ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(form);
        try {
            const response = await axios.post("/api/missions", {
                ...form
            });

            console.log("Server response:", response.data);
            alert("Data submitted successfully!");
        } catch (error) {
            console.log("SERVER ERROR:", error.response?.data);
            alert("Error occurred while submitting data!");
        }
    };

    return (
        <div className="users-container">
            <div className="users-header">
                <h1>إضافة مهمة جديدة</h1>
            </div>
            <form className="input-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label>اسم المهمة</label>
                        <input
                            type="text"
                            name="MissionName"
                            value={form.MissionName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label> رقم المنسق</label>
                        <input
                            type="number"
                            name="CoordinatorNum"
                            value={form.CoordinatorNum}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>السنة</label>
                        <select
                            type="number"
                            name="Year"
                            value={form.Year}
                            onChange={handleChange}
                            required
                        >
                            <option value="">- اختر السنة -</option>
                            <option value={2025}>2025</option>
                            <option value={2026}>2026</option>


                        </select>
                    </div>
                    <div className="form-group">
                        <label>الشهر</label>
                        <select
                            type="number"
                            name="Month"
                            value={form.Month}
                            onChange={handleChange}
                            required
                        >
                            <option value="">- اختر الشهر -</option>
                            <option value={1}>يناير</option>
                            <option value={2}>فبراير</option>
                            <option value={3}>مارس</option>
                            <option value={4}>أبريل</option>
                            <option value={5}>مايو</option>
                            <option value={6}>يونيو</option>
                            <option value={7}>يوليو</option>
                            <option value={8}>أغسطس</option>
                            <option value={9}>سبتمبر</option>
                            <option value={10}>أكتوبر</option>
                            <option value={11}>نوفمبر</option>
                            <option value={12}>ديسمبر</option>
                        </select>

                    </div>
                    <div className="form-group">
                        <label>اليوم</label>
                        <select
                            type="number"
                            name="Day"
                            value={form.Day}
                            onChange={handleChange}
                            required
                        >

                            <option value="">- اختر اليوم -</option>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                            <option value={6}>6</option>
                            <option value={7}>7</option>
                            <option value={8}>8</option>
                            <option value={9}>9</option>
                            <option value={10}>10</option>
                            <option value={11}>11</option>
                            <option value={12}>12</option>
                            <option value={13}>13</option>
                            <option value={14}>14</option>
                            <option value={15}>15</option>
                            <option value={16}>16</option>
                            <option value={17}>17</option>
                            <option value={18}>18</option>
                            <option value={19}>19</option>
                            <option value={20}>20</option>
                            <option value={21}>21</option>
                            <option value={22}>22</option>
                            <option value={23}>23</option>
                            <option value={24}>24</option>
                            <option value={25}>25</option>
                            <option value={26}>26</option>
                            <option value={27}>27</option>
                            <option value={28}>28</option>
                            <option value={29}>29</option>
                            <option value={30}>30</option>
                            <option value={31}>31</option>

                        </select>
                    </div>
                    <div className="form-group">
                        <label>مدة المهمة بالأيام</label>
                        <input
                            type="number"
                            name="DurationDays"
                            value={form.DurationDays}
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
                            name="MainCategory"
                            value={form.MainCategory}
                            onChange={handleChange}
                            required
                        >
                            <option value="">- اختر تصنيفًا -</option>
                            {mainCategories.map((mainCat) => (
                                <option key={mainCat.ID} value={mainCat.ID}>
                                    {mainCat.CategoryName}
                                </option>
                            ))}

                        </select>
                    </div>
                    <div className="form-group">
                        <label>التصنيف الفرعي</label>
                        <select
                            name="SubCategory"
                            value={form.SubCategory}
                            onChange={handleChange}
                            required
                        >
                            <option value="">- اختر تصنيفًا -</option>
                            {subCategories.map((subCat) => (
                                <option key={subCat.ID} value={subCat.ID}>
                                    {subCat.CategoryName}
                                </option>
                            ))}

                        </select>
                    </div>
                    <div className="form-group">
                        <label> تمت الإضافة بواسطة</label>
                        <input
                            name="CreatedBy"
                            value={form.CreatedBy}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>



                <div className="form-row">

                    {/* <div className="form-group">
                        <label>الوصف</label>
                        <input
                            type="text"
                            name="main_category"
                            value={form.main_category}
                            onChange={handleChange}
                            required
                        />
                    </div> */}

                </div>

                <button type="submit" className="function-button">
                    <i className="fas fa-plus"></i> إضافة المهمة
                </button>
            </form>
        </div>
    );
}
