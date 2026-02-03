import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function Reports() {
    const navigate = useNavigate();
    const [missions, setMissions] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState('missions');
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    });
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [missionsRes, usersRes] = await Promise.all([
                    api.get('/api/missions'),
                    api.get('/api/users')
                ]);
                setMissions(missionsRes.data.data || []);
                setUsers(usersRes.data.data || []);
                setFilteredData(missionsRes.data.data || []);
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Calculate statistics
    const totalMissions = missions.length;
    const totalUsers = users.length;
    const externalMissions = missions.filter(m => m.Type === 'external').length;
    const internalMissions = missions.filter(m => m.Type === 'internal').length;
    const usersWithFullBalance = users.filter(u => u.Balance >= 60).length;
    const usersWithLowBalance = users.filter(u => u.Balance < 20).length;

    const statsData = [
        { title: 'إجمالي المهام', value: totalMissions, change: `${externalMissions} خارجية`, icon: 'fas fa-tasks', color: 'blue' },
        { title: 'إجمالي المستخدمين', value: totalUsers, change: `${usersWithFullBalance} رصيد كامل`, icon: 'fas fa-users', color: 'green' },
        { title: 'المهام الداخلية', value: internalMissions, change: 'مهام داخلية', icon: 'fas fa-building', color: 'yellow' },
        { title: 'تنبيهات الرصيد', value: usersWithLowBalance, change: 'رصيد منخفض', icon: 'fas fa-exclamation-triangle', color: 'purple' }
    ];

    const reportTypes = [
        { id: 'missions', name: 'تقرير المهام', icon: 'fas fa-tasks' },
        { id: 'users', name: 'تقرير المستخدمين', icon: 'fas fa-users' },
        { id: 'external', name: 'المهام الخارجية', icon: 'fas fa-plane-departure' },
        { id: 'internal', name: 'المهام الداخلية', icon: 'fas fa-building' }
    ];

    const handleDateChange = (e) => {
        setDateRange({ ...dateRange, [e.target.name]: e.target.value });
    };

    const handleReportTypeChange = (type) => {
        setSelectedReport(type);

        // Filter data based on report type
        if (type === 'missions') {
            setFilteredData(missions);
        } else if (type === 'users') {
            setFilteredData(users);
        } else if (type === 'external') {
            setFilteredData(missions.filter(m => m.Type === 'external'));
        } else if (type === 'internal') {
            setFilteredData(missions.filter(m => m.Type === 'internal'));
        }
    };

    const handleGenerateReport = () => {
        let filtered = selectedReport === 'users' ? users : missions;

        // Filter by report type
        if (selectedReport === 'external') {
            filtered = missions.filter(m => m.Type === 'external');
        } else if (selectedReport === 'internal') {
            filtered = missions.filter(m => m.Type === 'internal');
        }

        // Filter by date range if provided
        if (dateRange.startDate && dateRange.endDate && selectedReport !== 'users') {
            const start = new Date(dateRange.startDate);
            const end = new Date(dateRange.endDate);

            filtered = filtered.filter(mission => {
                const missionDate = new Date(mission.Year, mission.Month - 1, mission.Day);
                return missionDate >= start && missionDate <= end;
            });
        }

        setFilteredData(filtered);
    };

    const handleExport = (format) => {
        if (format === 'pdf') {
            window.print();
        } else if (format === 'excel') {
            alert('سيتم تصدير التقرير بصيغة Excel قريباً');
        }
    };

    const formatDate = (day, month, year) => {
        const months = [
            'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
            'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
        ];
        return `${day} ${months[month - 1]} ${year}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg text-gray-600">جاري التحميل...</div>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 no-print">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-14 h-14 glass-card flex items-center justify-center text-gray-600 hover:bg-dark-green hover:text-white transition-all duration-300 group"
                    >
                        <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-1 text-dark-green">
                            <div className="w-1.5 h-6 bg-current rounded-full"></div>
                            <h1 className="text-3xl font-black tracking-tight text-gray-800">مركز التقارير</h1>
                        </div>
                        <p className="text-gray-500 font-bold pr-4">استخراج الإحصائيات، تحليل الأداء، وتوثيق المنجزات</p>
                    </div>
                </div>
            </div>

            <div className="report-content">
                {/* PDF-only Header (hidden in web view) */}
                <div className="hidden pdf-only mb-10 border-b-4 border-dark-green pb-8">
                    <div className="flex justify-between items-center bg-dark-green p-8 rounded-[2rem] text-white">
                        <div className="text-right">
                            <h1 className="text-4xl font-black mb-2">منصة توثيق</h1>
                            <p className="text-xl font-bold opacity-80 uppercase tracking-widest">
                                {selectedReport === 'missions' ? 'تقرير المهام العام' :
                                    selectedReport === 'users' ? 'تقرير بيانات المستخدمين' :
                                        selectedReport === 'external' ? 'تقرير المهام الخارجية' : 'تقرير المهام الداخلية'}
                            </p>
                        </div>
                        <div className="text-left font-black">
                            <div className="bg-white/10 px-4 py-2 rounded-xl mb-2">تاريخ التقرير: {new Date().toLocaleDateString('ar-SA')}</div>
                            {dateRange.startDate && <div className="text-sm opacity-60">المدى: من {dateRange.startDate} إلى {dateRange.endDate}</div>}
                        </div>
                    </div>
                </div>

                {/* Stats Grid - Shared for both views but styled differently for print */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {statsData.map((stat, index) => (
                        <div key={index} className="glass-card p-8 group relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-dark-green/10 group-hover:bg-dark-green transition-colors"></div>
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner ${stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                                        stat.color === 'green' ? 'bg-green-50 text-green-600' :
                                            stat.color === 'yellow' ? 'bg-yellow-50 text-yellow-600' :
                                                'bg-purple-50 text-purple-600'
                                    }`}>
                                    <i className={stat.icon}></i>
                                </div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.change}</span>
                            </div>
                            <h3 className="text-gray-500 font-bold text-xs mb-1 uppercase tracking-tighter">{stat.title}</h3>
                            <div className="text-3xl font-black text-gray-800 tracking-tight">{stat.value}</div>
                        </div>
                    ))}
                </div>

                {/* Filter Section - Hidden in Print */}
                <div className="glass-card p-10 mb-10 no-print border-dark-green/5 relative overflow-hidden">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-dark-green/5 rounded-full blur-3xl"></div>
                    <div className="relative z-10 space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-dark-green text-white rounded-xl flex items-center justify-center">
                                <i className="fas fa-sliders-h"></i>
                            </div>
                            <h2 className="text-2xl font-black text-gray-800">تخصيص البحث</h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
                            {/* Report Type */}
                            <div className="lg:col-span-5 space-y-3">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">نوع البيانات</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-3">
                                    {reportTypes.map(type => (
                                        <button
                                            key={type.id}
                                            onClick={() => handleReportTypeChange(type.id)}
                                            className={`p-4 rounded-2xl border-2 transition-all duration-300 flex items-center gap-3 group/btn ${selectedReport === type.id
                                                    ? 'border-dark-green bg-dark-green text-white shadow-lg'
                                                    : 'border-gray-100 bg-gray-50/50 text-gray-500 hover:border-dark-green/30 hover:bg-white'
                                                }`}
                                        >
                                            <i className={`${type.icon} text-lg ${selectedReport === type.id ? 'text-white' : 'text-dark-green'} group-hover/btn:scale-125 transition-transform`}></i>
                                            <span className="text-xs font-black">{type.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Date Range */}
                            <div className="lg:col-span-4 grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">من تاريخ</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={dateRange.startDate}
                                        onChange={handleDateChange}
                                        className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-dark-green focus:bg-white outline-none font-bold text-gray-800 transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">إلى تاريخ</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={dateRange.endDate}
                                        onChange={handleDateChange}
                                        className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-dark-green focus:bg-white outline-none font-bold text-gray-800 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="lg:col-span-3 flex gap-3">
                                <button
                                    onClick={handleGenerateReport}
                                    className="flex-1 py-4 premium-gradient text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:shadow-xl transition-all shadow-lg active:scale-95"
                                >
                                    <i className="fas fa-sync-alt"></i>
                                    تحديث
                                </button>
                                <button
                                    onClick={() => handleExport('pdf')}
                                    className="w-16 h-14 bg-slate-800 text-white rounded-2xl flex items-center justify-center text-xl hover:bg-black transition-all shadow-lg active:scale-95"
                                    title="طباعة التقرير"
                                >
                                    <i className="fas fa-print"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Container */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-6 no-print">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-black text-gray-400 uppercase tracking-widest">نتائج البحث المستخرجة ({filteredData.length})</span>
                        </div>
                    </div>

                    {/* Results List - Modern Row Design */}
                    <div className="space-y-3">
                        {selectedReport === 'users' ? (
                            // User Rows
                            filteredData.length > 0 ? (
                                filteredData.map(user => (
                                    <div key={user.ID} className="glass-card p-6 group hover:translate-x-[-8px] transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50">
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                            <div className="md:col-span-4 flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-dark-green font-black text-xl border-2 border-white shadow-sm">
                                                    {user.Name.charAt(0)}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <h3 className="font-black text-gray-800 text-lg group-hover:text-dark-green transition-colors truncate">{user.Name}</h3>
                                                    <p className="text-xs font-bold text-gray-400 truncate">{user.Email}</p>
                                                </div>
                                            </div>
                                            <div className="md:col-span-3">
                                                <span className="inline-flex px-4 py-1.5 rounded-xl text-[10px] font-black bg-blue-50/50 text-blue-700 border border-blue-100/30 uppercase tracking-tighter">
                                                    {user.Job === 'photo' ? 'مصور فوتو' : user.Job === 'video' ? 'مصور فيديو' : user.Job}
                                                </span>
                                            </div>
                                            <div className="md:col-span-2">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-gray-300 uppercase leading-none mb-1">الرصيد</span>
                                                    <span className={`text-lg font-black ${user.Balance > 20 ? 'text-green-600' : 'text-red-600'}`}>{user.Balance} يوم</span>
                                                </div>
                                            </div>
                                            <div className="md:col-span-3 text-left">
                                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter ${user.Balance >= 60 ? 'bg-emerald-100/50 text-emerald-700' :
                                                        user.Balance >= 20 ? 'bg-amber-100/50 text-amber-700' :
                                                            'bg-rose-100/50 text-rose-700'
                                                    }`}>
                                                    حالة الرصيد: {user.Balance >= 60 ? 'ممتار' : user.Balance >= 20 ? 'جيد' : 'حرج'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <EmptyState />
                            )
                        ) : (
                            // Mission Rows
                            filteredData.length > 0 ? (
                                filteredData.map(mission => (
                                    <div key={mission.ID} onClick={() => navigate(`/dashboard/missions/${mission.ID}`)} className="glass-card p-6 group hover:translate-x-[-8px] transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 cursor-pointer">
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                            <div className="md:col-span-5 flex items-center gap-5">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-sm ${mission.Type === 'external' ? 'bg-purple-100 text-purple-600' : 'bg-emerald-100 text-emerald-600'
                                                    }`}>
                                                    <i className={`fas ${mission.Type === 'external' ? 'fa-globe-americas' : 'fa-building'}`}></i>
                                                </div>
                                                <div className="overflow-hidden">
                                                    <h3 className="font-black text-gray-800 text-lg group-hover:text-dark-green transition-colors truncate">{mission.MissionName}</h3>
                                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mt-0.5">
                                                        <i className="far fa-compass"></i>
                                                        <span>{mission.Type === 'external' ? 'مهمة خارجية' : 'مهمة داخلية'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="md:col-span-3">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <i className="far fa-calendar-check text-dark-green opacity-40"></i>
                                                    <span className="text-sm font-black font-mono">{formatDate(mission.Day, mission.Month, mission.Year)}</span>
                                                </div>
                                            </div>
                                            <div className="md:col-span-2">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-gray-300 uppercase leading-none mb-1">المدة</span>
                                                    <span className="text-sm font-black text-gray-800">{mission.DurationDays} أيام</span>
                                                </div>
                                            </div>
                                            <div className="md:col-span-2 text-left">
                                                <div className="text-[10px] font-black text-gray-300 uppercase mb-1">المنسق</div>
                                                <div className="text-xs font-black text-gray-800 truncate">{mission.CoordinatorName || 'غير محدد'}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <EmptyState />
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* Print Optimization Styles */}
            <style>{`
        @media print {
            @page { size: A4; margin: 1cm; }
            body { background: white !important; font-family: 'Inter', 'Arial', sans-serif; }
            .no-print { display: none !important; }
            .pdf-only { display: block !important; }
            .report-content { width: 100% !important; margin: 0 !important; }
            .glass-card { 
                background: white !important; 
                border: 1px solid #eee !important; 
                box-shadow: none !important;
                border-radius: 1rem !important;
                page-break-inside: avoid;
            }
            h1, h2, h3, h4 { color: #1a4d4a !important; }
            .text-gray-500, .text-gray-400 { color: #666 !important; }
            
            /* Ensure text contrast for print */
            .text-white { color: white !important; -webkit-print-color-adjust: exact; }
            .bg-dark-green { background-color: #1a4d4a !important; -webkit-print-color-adjust: exact; }
            
            .flex, .grid { display: flex !important; }
            .grid-cols-4 > * { width: 25% !important; float: right !important; }
            .md\\:col-span-8 { width: 66% !important; }
            .md\\:col-span-4 { width: 33% !important; }
            
            /* Arabic Support for print */
            * { direction: rtl !important; }
        }
      `}</style>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="glass-card p-24 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 text-5xl">
                <i className="fas fa-folder-open"></i>
            </div>
            <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-800">لا توجد بيانات</h3>
                <p className="text-gray-400 font-bold max-w-xs mx-auto">لم نعثر على أي نتائج مطابقة لتخصيص البحث الحالي، جرب تغيير المدى الزمني أو نوع التقرير</p>
            </div>
        </div>
    );
}

