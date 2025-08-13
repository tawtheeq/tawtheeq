import { useState } from 'react';
import '../styles/pages/missions.scss';

export default function Addmission() {


    const [form, setForm] = useState({
        mission_name: '',
        year: '',
        location: '',
        main_person: '',
        main_category: '',
        status: ''
    });

    const photographers = [
        { id: 1, name: 'أحمد', delegationBalance: 5, leaves: ['2025-08-15', '2025-08-16'] },
        { id: 2, name: 'سارة', delegationBalance: 0, leaves: [] },
        { id: 3, name: 'خالد', delegationBalance: 3, leaves: ['2025-08-11'] },

    ];


    const [selectedPhotographers, setSelectedPhotographers] = useState([]);
    const taskDate = '2025-08-11';

    const getAvailablePhotographers = () => {
        return photographers.filter(p => !selectedPhotographers.includes(p.id));
    };

    const handlePhotographerSelect = (e) => {
        const photographerId = parseInt(e.target.value);
        const selected = photographers.find(p => p.id === photographerId);

        if (!selected) return;

        // تحقق من الرصيد
        if (selected.delegationBalance <= 0) {
            alert(`${selected.name} لا يملك رصيد انتداب كافٍ`);
            return;
        }

        // تحقق من الإجازة
        if (selected.leaves.includes(taskDate)) {
            alert(`${selected.name} لديه إجازة في تاريخ المهمة`);
            return;
        }

        // إذا كل شيء تمام، أضفه
        setSelectedPhotographers([...selectedPhotographers, photographerId]);
    };



    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('تمت إضافة المهمة:', form);
        setForm({
            mission_name: '',
            year: '',
            location: '',
            main_person: '',
            main_category: '',
            status: ''
        });
    };

    return (
        <div className="users-container">
            <div className="users-header">
                <h1>إضافة مهمة جديدة</h1>
            </div>
            <form className="mission-form" onSubmit={handleSubmit}>
                <div className='form-row'>

                    <div className="form-group">
                        <label>اسم المهمة</label>
                        <input
                            type="text"
                            name="mission_name"
                            value={form.mission_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>السنة</label>
                        <input
                            type="number"
                            name="year"
                            value={form.year}
                            onChange={handleChange}
                            required
                        />
                    </div>

                </div>


                <div className="form-row">
                    <div className="form-group">
                        <label>الشهر</label>
                        <input
                            type="text"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>الممثل الرئيسي</label>
                        <input
                            type="text"
                            name="main_person"
                            value={form.main_person}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>التصنيف الرئيسي</label>
                        <input
                            type="text"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>التصنيف الفرعي</label>
                        <input
                            type="text"
                            name="main_person"
                            value={form.main_person}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>المنطقة</label>
                        <input
                            type="text"
                            name="main_category"
                            value={form.main_category}
                            onChange={handleChange}
                            required
                        />
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
                <div className="form-row">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div className='form-group' key={index}>
                            <label>المصور رقم {index + 1}</label>
                            <select onChange={handlePhotographerSelect}>
                                <option value="">اختر مصور</option>
                                {getAvailablePhotographers().map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                    ))}

                </div>
            
             

                <button type="submit" className="add-user-btn">
                    <i className="fas fa-plus"></i>
                    إضافة المهمة
                </button>
            </form>
        </div>
    );
}