import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
                    axios.get('/api/missions'),
                    axios.get('/api/users')
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
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">التقارير</h1>
                <p className="text-sm text-gray-500 mt-1">عرض وإنشاء التقارير التفصيلية</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsData.map((stat, index) => (
                    <div key={index} className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                                stat.color === 'green' ? 'bg-green-50 text-green-600' :
                                    stat.color === 'yellow' ? 'bg-yellow-50 text-yellow-600' :
                                        'bg-purple-50 text-purple-600'
                                }`}>
                                <i className={`${stat.icon} text-xl`}></i>
                            </div>
                            <span className="text-sm font-semibold text-gray-500">{stat.change}</span>
                        </div>
                        <div className="text-sm font-medium text-gray-500 mb-1">{stat.title}</div>
                        <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Report Generation Form */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6">إنشاء تقرير جديد</h2>

                <div className="space-y-6">
                    {/* Report Type Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">نوع التقرير</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {reportTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => handleReportTypeChange(type.id)}
                                    className={`p-4 rounded-xl border-2 transition-all ${selectedReport === type.id
                                        ? 'border-green-700 bg-green-50 text-green-700'
                                        : 'border-gray-200 bg-white hover:border-green-300 text-gray-600'
                                        }`}
                                >
                                    <i className={`${type.icon} text-2xl mb-2 block`}></i>
                                    <span className="text-sm font-medium">{type.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date Range - Only show for mission reports */}
                    {selectedReport !== 'users' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">من تاريخ</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={dateRange.startDate}
                                    onChange={handleDateChange}
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">إلى تاريخ</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={dateRange.endDate}
                                    onChange={handleDateChange}
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                                />
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleGenerateReport}
                            className="px-6 py-2 bg-green-700 text-white rounded-xl hover:bg-green-800 transition-colors flex items-center gap-2"
                        >
                            <i className="fas fa-sync-alt"></i>
                            تحديث التقرير
                        </button>
                        <button
                            onClick={() => handleExport('pdf')}
                            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <i className="fas fa-file-pdf"></i>
                            طباعة PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* Report Results */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <i className="fas fa-chart-bar text-green-700"></i>
                        نتائج التقرير ({filteredData.length})
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    {selectedReport === 'users' ? (
                        // Users Report
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">الاسم</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">البريد الإلكتروني</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">الوظيفة</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">الرصيد</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">الحالة</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredData.map((user) => (
                                    <tr key={user.ID} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-800">{user.Name}</td>
                                        <td className="px-6 py-4 text-gray-600">{user.Email}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {user.Job === 'photo' ? 'مصور فوتوغرافي' : user.Job === 'video' ? 'مصور فيديو' : user.Job}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`font-bold ${user.Balance > 20 ? 'text-green-600' : user.Balance > 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                {user.Balance} يوم
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.Balance >= 60 ? 'bg-green-100 text-green-700' :
                                                    user.Balance >= 20 ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {user.Balance >= 60 ? 'ممتاز' : user.Balance >= 20 ? 'جيد' : 'منخفض'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        // Missions Report
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">اسم المهمة</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">التاريخ</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">المدة</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">النوع</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">المنسق</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredData.map((mission) => (
                                    <tr
                                        key={mission.ID}
                                        className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                                        onClick={() => navigate(`/dashboard/missions/${mission.ID}`)}
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-800">{mission.MissionName}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {formatDate(mission.Day, mission.Month, mission.Year)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                {mission.DurationDays} يوم
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${mission.Type === 'external'
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : 'bg-green-100 text-green-700'
                                                }`}>
                                                {mission.Type === 'external' ? 'خارجية' : 'داخلية'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{mission.CoordinatorName || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {filteredData.length === 0 && (
                    <div className="p-12 text-center">
                        <i className="fas fa-inbox text-6xl text-gray-300 mb-4"></i>
                        <p className="text-gray-500">لا توجد بيانات لعرضها</p>
                    </div>
                )}
            </div>

            {/* Print Styles */}
            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .p-6.max-w-7xl.mx-auto, .p-6.max-w-7xl.mx-auto * {
                        visibility: visible;
                    }
                    .p-6.max-w-7xl.mx-auto {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    button {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
}
