import { useState } from 'react';

export default function Reports() {
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    });

    const [selectedReport, setSelectedReport] = useState('');

    const reportTypes = [
        { id: 'missions', name: 'تقرير المهام', icon: 'fas fa-tasks' },
        { id: 'users', name: 'تقرير المستخدمين', icon: 'fas fa-users' },
        { id: 'categories', name: 'تقرير التصنيفات', icon: 'fas fa-folder' },
        { id: 'performance', name: 'تقرير الأداء', icon: 'fas fa-chart-line' }
    ];

    const statsData = [
        { title: 'إجمالي المهام', value: '156', change: '+12%', icon: 'fas fa-tasks', color: 'blue' },
        { title: 'المهام المكتملة', value: '89', change: '+8%', icon: 'fas fa-check-circle', color: 'green' },
        { title: 'المهام الجارية', value: '45', change: '+5%', icon: 'fas fa-spinner', color: 'yellow' },
        { title: 'المستخدمين النشطين', value: '24', change: '+3%', icon: 'fas fa-user-check', color: 'purple' }
    ];

    const handleDateChange = (e) => {
        setDateRange({ ...dateRange, [e.target.name]: e.target.value });
    };

    const handleGenerateReport = () => {
        console.log('Generating report:', { selectedReport, dateRange });
        alert('جاري إنشاء التقرير...');
    };

    const handleExport = (format) => {
        console.log(`Exporting as ${format}`);
        alert(`جاري تصدير التقرير بصيغة ${format}...`);
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">التقارير</h1>
                <p className="text-gray-500 mt-1">عرض وإنشاء التقارير التفصيلية</p>
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
                            <span className="text-sm font-semibold text-green-600">{stat.change}</span>
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
                                    onClick={() => setSelectedReport(type.id)}
                                    className={`p-4 rounded-xl border-2 transition-all ${selectedReport === type.id
                                        ? 'border-green-800 bg-green-50 text-green-800'
                                        : 'border-gray-200 bg-white hover:border-green-300 text-gray-600'
                                        }`}
                                >
                                    <i className={`${type.icon} text-2xl mb-2 block`}></i>
                                    <span className="text-sm font-medium">{type.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date Range */}
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

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-6 border-t border-gray-100 flex justify-end">
                        <button
                            onClick={handleGenerateReport}
                            disabled={!selectedReport}
                            className="px-6 py-3 bg-green-800 text-white font-semibold rounded-xl hover:bg-green-900 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                        >
                            <i className="fas fa-file-alt"></i>
                            <span>إنشاء التقرير</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Export Options */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6">تصدير التقارير</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => handleExport('PDF')}
                        className="p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all group"
                    >
                        <i className="fas fa-file-pdf text-3xl text-red-500 mb-2 block"></i>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-green-800">تصدير PDF</span>
                    </button>

                    <button
                        onClick={() => handleExport('Excel')}
                        className="p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all group"
                    >
                        <i className="fas fa-file-excel text-3xl text-green-600 mb-2 block"></i>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-green-800">تصدير Excel</span>
                    </button>

                    <button
                        onClick={() => handleExport('CSV')}
                        className="p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all group"
                    >
                        <i className="fas fa-file-csv text-3xl text-blue-600 mb-2 block"></i>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-green-800">تصدير CSV</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
