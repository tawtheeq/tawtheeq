import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UserReport() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await axios.get(`/api/users/${id}/report`);
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

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg text-red-600">حدث خطأ: {error}</div>
            </div>
        );
    }

    const { user, missions } = reportData;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/dashboard/users')}
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <i className="fas fa-arrow-right"></i>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">تقرير الموظف</h1>
                        <p className="text-sm text-gray-500 mt-1">{user.Name}</p>
                    </div>
                </div>
                <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-dark-green text-white rounded-xl hover:bg-light-green transition-colors flex items-center gap-2"
                >
                    <i className="fas fa-print"></i>
                    طباعة
                </button>
            </div>

            {/* User Info Card */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-8 mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <i className="fas fa-user text-green-700"></i>
                    معلومات الموظف
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2 ">
                        <p className="text-sm text-gray-500">الاسم</p>
                        <p className="text-lg font-semibold text-gray-800">{user.Name}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                        <p className="text-lg font-semibold text-gray-800">{user.Email}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm text-gray-500">رقم الجوال</p>
                        <p className="text-lg font-semibold text-gray-800 font-mono">{user.Mobile}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm text-gray-500">الوظيفة</p>
                        <p className="text-lg font-semibold text-gray-800">
                            {user.Job === 'photo' ? 'مصور فوتوغرافي' : user.Job === 'video' ? 'مصور فيديو' : user.Job}
                        </p>
                    </div>
                    {/* <div className="space-y-2">
                        <p className="text-sm text-gray-500">الصلاحية</p>
                        <p className="text-lg font-semibold text-gray-800">
                            {user.Role === 'admin' ? 'مدير' : 'مستخدم'}
                        </p>
                    </div> */}
                    <div className="space-y-2">
                        <p className="text-sm text-gray-500">الرصيد المتبقي</p>
                        <p className={`text-2xl font-bold ${user.Balance > 20 ? 'text-green-600' : user.Balance > 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {user.Balance} يوم
                        </p>
                    </div>
                </div>
            </div>

            {/* Missions Table */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <i className="fas fa-tasks text-green-700"></i>
                        المهام المشارك فيها ({missions?.length || 0})
                    </h2>
                </div>

                {missions && missions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">اسم المهمة</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">التاريخ</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">المدة</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">الدور</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {missions.map((mission) => (
                                    <tr key={mission.ID} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-800">{mission.MissionName}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {formatDate(mission.Day, mission.Month, mission.Year)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                {mission.DurationDays} يوم
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{mission.Type || 'مصور'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <i className="fas fa-inbox text-6xl text-gray-300 mb-4"></i>
                        <p className="text-gray-500">لا توجد مهام مسجلة لهذا الموظف</p>
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
