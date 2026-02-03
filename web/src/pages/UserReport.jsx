import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function UserReport() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await api.get(`/api/users/${id}/report`);
                setReportData(response.data.data);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching user report:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [id]);

    if (loading || !reportData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg text-gray-600">جاري التحميل...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg text-red-600">حدث خطأ: {error}</div>
            </div>
        );
    }

    const formatDate = (day, month, year) => {
        const months = [
            'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
            'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
        ];
        return `${day} ${months[month - 1]} ${year}`;
    };

    const { user, missions } = reportData;

    return (
        <div className="space-y-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 no-print">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/dashboard/users')}
                        className="w-14 h-14 glass-card flex items-center justify-center text-gray-600 hover:bg-dark-green hover:text-white transition-all duration-300 group"
                    >
                        <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-1 text-dark-green">
                            <div className="w-1.5 h-6 bg-current rounded-full"></div>
                            <h1 className="text-3xl font-black tracking-tight text-gray-800">سجل إنجازات الموظف</h1>
                        </div>
                        <p className="text-gray-500 font-bold pr-4">استعراض المهام المنجزة وتحليل الأداء الفني لـ {user.Name}</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => window.print()}
                        className="px-8 py-4 premium-gradient text-white font-black rounded-2xl hover:shadow-2xl hover:shadow-green-900/40 transition-all duration-300 flex items-center gap-3 active:scale-[0.98]"
                    >
                        <i className="fas fa-print"></i>
                        <span>طباعة التقرير</span>
                    </button>
                </div>
            </div>

            <div className="report-content space-y-10">
                {/* PDF-only Header (hidden in web view) */}
                <div className="hidden pdf-only mb-10 border-b-4 border-dark-green pb-8">
                    <div className="flex justify-between items-center bg-dark-green p-8 rounded-[2rem] text-white">
                        <div className="text-right">
                            <h1 className="text-4xl font-black mb-2">منصة توثيق</h1>
                            <p className="text-xl font-bold opacity-80 uppercase tracking-widest text-white">تقرير الأداء السنوي للموظف</p>
                        </div>
                        <div className="text-left font-black">
                            <div className="bg-white/10 px-4 py-2 rounded-xl mb-2 text-white">تاريخ التقرير: {new Date().toLocaleDateString('ar-SA')}</div>
                        </div>
                    </div>
                </div>

                {/* User Identity & Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* ID Card */}
                    <div className="lg:col-span-8">
                        <div className="glass-card p-10 relative overflow-hidden h-full">
                            <div className="absolute top-0 left-0 w-2 h-full bg-dark-green opacity-20"></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    <div className="flex items-center gap-5">
                                        <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center text-dark-green font-black text-3xl border-2 border-white shadow-inner">
                                            {user.Name.charAt(0)}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-gray-800">{user.Name}</h2>
                                            <span className="inline-flex px-3 py-1 rounded-lg text-[10px] font-black bg-dark-green/5 text-dark-green border border-dark-green/10 uppercase tracking-widest mt-1">
                                                {user.Job === 'photo' ? 'مصور فوتوغرافي' : user.Job === 'video' ? 'مصور فيديو' : user.Job}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">البريد الإلكتروني</span>
                                            <p className="text-sm font-bold text-gray-600 truncate">{user.Email}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">رقم الجوال</span>
                                            <p className="text-sm font-bold text-gray-600 font-mono tracking-tighter">{user.Mobile}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-between p-8 bg-slate-50 rounded-3xl border border-white/50 relative overflow-hidden group">
                                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-dark-green/5 rounded-full blur-2xl group-hover:bg-dark-green/10 transition-all duration-700"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">رصيد المهام المتبقي</span>
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-dark-green text-xs shadow-sm">
                                                <i className="fas fa-shield-alt"></i>
                                            </div>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className={`text-6xl font-black ${user.Balance > 20 ? 'text-dark-green' : 'text-rose-600'} tracking-tighter`}>{user.Balance}</span>
                                            <span className="text-lg font-black text-gray-400">يوم</span>
                                        </div>
                                        <div className="mt-4 flex items-center gap-2">
                                            <div className="flex-1 h-1.5 bg-white rounded-full overflow-hidden p-0.5">
                                                <div
                                                    className={`h-full rounded-full ${user.Balance > 20 ? 'bg-dark-green' : 'bg-rose-500'}`}
                                                    style={{ width: `${Math.min(100, (user.Balance / 60) * 100)}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-[10px] font-black text-gray-400 uppercase">{user.Balance >= 60 ? 'مكتمل' : 'قيد الاستهلاك'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Sidebar */}
                    <div className="lg:col-span-4 grid grid-cols-1 gap-6">
                        <div className="glass-card p-8 relative overflow-hidden group">
                            <div className="relative z-10 flex items-center gap-6">
                                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl">
                                    <i className="fas fa-tasks"></i>
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">إجمالي المهام</div>
                                    <div className="text-4xl font-black tracking-tighter">{missions?.length || 0}</div>
                                </div>
                            </div>
                        </div>
                        <div className="glass-card p-8 relative overflow-hidden group">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl">
                                    <i className="fas fa-star"></i>
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">تقييم الموظف</div>
                                    <div className="text-4xl font-black text-gray-800 tracking-tighter">{missions?.reduce((acc, m) => acc + m.DurationDays, 0) || 0} <span className="text-lg text-gray-300"> / 100</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Missions List */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-dark-green/10 text-dark-green rounded-lg flex items-center justify-center text-sm">
                                <i className="fas fa-list-ul"></i>
                            </div>
                            <h2 className="text-xl font-black text-gray-800">سجل المهام التفصيلي</h2>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {missions && missions.length > 0 ? (
                            missions.map((mission) => (
                                <div key={mission.ID} className="glass-card p-6 group hover:translate-x-[-8px] transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50">
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                        <div className="md:col-span-6 flex items-center gap-5">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-sm ${mission.Type === 'external' ? 'bg-purple-100 text-purple-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                                <i className={`fas ${mission.Type === 'external' ? 'fa-globe-americas' : 'fa-building'}`}></i>
                                            </div>
                                            <div className="overflow-hidden">
                                                <h3 className="font-black text-gray-800 text-lg group-hover:text-dark-green transition-colors truncate">{mission.MissionName}</h3>
                                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mt-0.5">
                                                    <i className="far fa-map"></i>
                                                    <span>{mission.Type === 'external' ? 'مهمة خارجية' : 'مهمة داخلية'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="md:col-span-3">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <i className="far fa-calendar-alt text-dark-green opacity-40"></i>
                                                <span className="text-sm font-black font-mono tracking-tighter">{formatDate(mission.Day, mission.Month, mission.Year)}</span>
                                            </div>
                                        </div>
                                        <div className="md:col-span-3 text-left">
                                            <div className="flex flex-col items-start md:items-end">
                                                <span className="text-[10px] font-black text-gray-300 uppercase mb-1">المدة الزمنية</span>
                                                <span className="px-5 py-2 rounded-2xl bg-slate-100 text-slate-800 text-sm font-black border-2 border-white shadow-sm">{mission.DurationDays} يوم</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="glass-card p-20 flex flex-col items-center justify-center text-center space-y-6">
                                <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 text-5xl">
                                    <i className="fas fa-folder-open"></i>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-gray-800">لا توجد مهام</h3>
                                    <p className="text-gray-400 font-bold max-w-xs mx-auto">لم يتم تسجيل أي مهام لهذا الموظف في النظام حتى الآن</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Print Optimization Styles */}
            <style>{`
        @media print {
            @page { size: A4; margin: 1.5cm; }
            body { background: white !important; font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
            .no-print { display: none !important; }
            .pdf-only { display: block !important; }
            .report-content { width: 100% !important; margin: 0 !important; }
            .glass-card { 
                background: white !important; 
                border: 1px solid #f0f0f0 !important; 
                box-shadow: none !important;
                border-radius: 1.5rem !important;
                page-break-inside: avoid;
            }
            .bg-slate-50, .bg-slate-100, .bg-blue-50, .bg-emerald-100, .bg-purple-100 { 
                background-color: #f8fafc !important; 
                -webkit-print-color-adjust: exact;
            }
            h1, h2, h3, h4 { color: #1a4d4a !important; }
            
            /* Text colors for print */
            .text-dark-green { color: #1a4d4a !important; }
            .text-gray-800 { color: #1e293b !important; }
            .text-gray-600 { color: #475569 !important; }
            .text-gray-400, .text-gray-300 { color: #94a3b8 !important; }
            
            /* Backgrounds for print */
            .bg-dark-green { background-color: #1a4d4a !important; -webkit-print-color-adjust: exact; }
            .bg-slate-900 { background-color: #0f172a !important; -webkit-print-color-adjust: exact; }
            .premium-gradient { background: #1a4d4a !important; -webkit-print-color-adjust: exact; }
            
            /* Grid layout for print */
            .grid { display: flex !important; flex-wrap: wrap !important; gap: 1rem !important; }
            .grid-cols-12 > * { float: right !important; }
            .lg\\:col-span-8 { width: 65% !important; }
            .lg\\:col-span-4 { width: 33% !important; }
            .md\\:col-span-6 { width: 48% !important; }
            .md\\:col-span-3 { width: 24% !important; }
            
            /* RTL specific */
            * { direction: rtl !important; text-align: right !important; }
            .text-left { text-align: left !important; }
        }
      `}</style>
        </div>
    );
}

