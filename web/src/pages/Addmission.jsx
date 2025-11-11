import { useState } from 'react';
import '../styles/pages/missions.scss';
import { use } from 'react';

export default function Addmission() {


    const [mainCategories, setMainCtegories] = useState([])

    const [form, setForm] = useState({
        mission_name: '',
        year: '',
        location: '',
        main_person: '',
        main_category: '',
        status: '',
    });

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

    const handleSubmit = (e) => {
        e.preventDefault();

        // يمكنك هنا إرسال بيانات المهمة مع المصورين إلى الخادم
        console.log('بيانات المهمة:', form);
        console.log('المصورون المختارون:', selectedPhotographers);


        const misionData = {
            ...form,
            photographers
        }

        setForm({
            mission_name: '',
            year: '',
            location: '',
            main_person: '',
            main_category: '',
            status: '',
        });
        setSelectedPhotographers({
            p1: '',
            p2: '',
            p3: '',
            p4: '',
            p5: '',
        });
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
                            name="mission_name"
                            value={form.mission_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                   <div className="form-group">
                        <label> رقم المنسق</label>
                        <input
                            type="text"
                            name="mission_name"
                            value={form.mission_name}
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
                            value={form.year}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>الشهر</label>
                        <input
                            type="number"
                            name="year"
                            value={form.year}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>اليوم</label>
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
                        <label>التصنيف الرئيسي</label>
                        <input
                            type="text"
                            name="main_category"
                            value={form.main_category}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>التصنيف الفرعي</label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="">اختر الحالة</option>
                            <option value="نشط">نشط</option>
                            <option value="غير نشط">غير نشط</option>
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
