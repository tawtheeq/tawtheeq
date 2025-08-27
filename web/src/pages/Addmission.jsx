import { useState } from 'react';
import '../styles/pages/missions.scss';

export default function Addmission() {
    const [form, setForm] = useState({
        mission_name: '',
        year: '',
        location: '',
        main_person: '',
        main_category: '',
        status: '',
    });

    const photographers = [
        { id: 1, name: 'أحمد', delegationBalance: 5, leaves: [{ from: '2025-08-14', to: '2025-09-23' }] },
        { id: 2, name: 'سارة', delegationBalance: 0, leaves: [] },
        { id: 3, name: 'خالد', delegationBalance: 3, leaves: [{ from: '2025-08-14', to: '2025-09-01' }] },
        { id: 4, name: 'مريم', delegationBalance: 2, leaves: [] },
        { id: 5, name: 'يوسف', delegationBalance: 1, leaves: [{ from: '2025-09-10', to: '2025-09-15' }] },
    ];

    const [selectedPhotographers, setSelectedPhotographers] = useState({
        p1: '',
        p2: '',
        p3: '',
        p4: '',
        p5: '',
    });

    const taskStart = '2025-09-13';
    const taskEnd = '2025-09-20';

    // دالة للتحقق من تداخل تواريخ الإجازة مع فترة المهمة
    const isDateRangeOverlapping = (start1, end1, start2, end2) => {
        const s1 = new Date(start1);
        const e1 = new Date(end1);
        const s2 = new Date(start2);
        const e2 = new Date(end2);
        return s1 <= e2 && e1 >= s2;
    };

    // دالة لإرجاع قائمة المصورين المتاحين مع استثناء المصورين المختارين في الحقول الأخرى
  const getAvailablePhotographers = (currentFieldKey) => {
  const selectedIds = [];

  for (const key in selectedPhotographers) {
    if (key !== currentFieldKey && selectedPhotographers[key]) {
      selectedIds.push(selectedPhotographers[key]);
    }
  }

  return photographers.filter(p => !selectedIds.includes(p.id.toString()));
};

    // دالة معالجة اختيار المصور لكل حقل بشكل مستقل
    const handlePhotographerSelect = (fieldKey, e) => {
        const photographerId = e.target.value;

        // إذا لم يتم اختيار مصور (إلغاء الاختيار)
        if (photographerId === '') {
            setSelectedPhotographers(prev => ({ ...prev, [fieldKey]: '' }));
            return;
        }

        const selected = photographers.find(p => p.id.toString() === photographerId);
        if (!selected) return;

        // تحقق من رصيد الانتداب
        if (selected.delegationBalance <= 0) {
            alert(`${selected.name} لا يملك رصيد انتداب كافٍ`);
            return;
        }

        // تحقق من تعارض الإجازة مع فترة المهمة
        const hasLeaveConflict = selected.leaves.some(leave =>
            isDateRangeOverlapping(taskStart, taskEnd, leave.from, leave.to)
        );
        if (hasLeaveConflict) {
            alert(`${selected.name} لديه إجازة تتعارض مع فترة المهمة`);
            return;
        }

        // تحديث حالة المصور المختار لهذا الحقل
        setSelectedPhotographers(prev => ({ ...prev, [fieldKey]: photographerId }));
    };

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
                        <label>الموقع</label>
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
                            name="main_category"
                            value={form.main_category}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>الحالة</label>
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

                {/* حقول اختيار المصورين بشكل يدوي ومنفصل */}
                <div className="form-row">
                    <div className="form-group">
                        <label>المصور رقم 1</label>
                        <select
                            value={selectedPhotographers.p1}
                            onChange={(e) => handlePhotographerSelect('p1', e)}
                        >
                            <option value="">اختر مصور</option>
                            {getAvailablePhotographers('p1').map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                            {selectedPhotographers.p1 && (
                                <option value="">إلغاء الاختيار</option>
                            )}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>المصور رقم 2</label>
                        <select
                            value={selectedPhotographers.p2}
                            onChange={(e) => handlePhotographerSelect('p2', e)}
                        >
                            <option value="">اختر مصور</option>
                            {getAvailablePhotographers('p2').map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                            {selectedPhotographers.p2 && (
                                <option value="">إلغاء الاختيار</option>
                            )}
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>المصور رقم 3</label>
                        <select
                            value={selectedPhotographers.p3}
                            onChange={(e) => handlePhotographerSelect('p3', e)}
                        >
                            <option value="">اختر مصور</option>
                            {getAvailablePhotographers('p3').map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                            {selectedPhotographers.p3 && (
                                <option value="">إلغاء الاختيار</option>
                            )}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>المصور رقم 4</label>
                        <select
                            value={selectedPhotographers.p4}
                            onChange={(e) => handlePhotographerSelect('p4', e)}
                        >
                            <option value="">اختر مصور</option>
                            {getAvailablePhotographers('p4').map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                            {selectedPhotographers.p4 && (
                                <option value="">إلغاء الاختيار</option>
                            )}
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>المصور رقم 5</label>
                        <select
                            value={selectedPhotographers.p5}
                            onChange={(e) => handlePhotographerSelect('p5', e)}
                        >
                            <option value="">اختر مصور</option>
                            {getAvailablePhotographers('p5').map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                            {selectedPhotographers.p5 && (
                                <option value="">إلغاء الاختيار</option>
                            )}
                        </select>
                    </div>
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
