import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import api from '../api/client';

export default function MissionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [mission, setMission] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch mission details
        const missionRes = await api.get(`/api/missions/${id}`);
        setMission(missionRes.data.data);

        // Fetch participants
        const participantsRes = await api.get(`/api/missions/${id}/participants`);
        setParticipants(participantsRes.data.data || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching mission details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleRemoveParticipant = async (participantId) => {
    if (!window.confirm('هل أنت متأكد من إزالة هذا المشارك من المهمة؟')) {
      return;
    }

    try {
      await api.delete(`/api/missions/${id}/participants/${participantId}`);

      // Reload participants list from server
      const participantsRes = await api.get(`/api/missions/${id}/participants`);
      setParticipants(participantsRes.data.data || []);

      alert('تم إزالة المشارك بنجاح!');
    } catch (err) {
      console.error('Error removing participant:', err);
      alert(`حدث خطأ أثناء إزالة المشارك: ${err.response?.data?.message || err.message}`);
    }
  };

  const formatDate = (day, month, year) => {
    const months = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    return `${day} ${months[month - 1]} ${year}`;
  };

  const formatParticipantsForShare = () => {
    if (!participants.length) return 'لا يوجد مشاركون حتى الآن.';
    return participants
      .map((participant, index) => `${index + 1}. ${participant.Name} - ${participant.Mobile} - ${participant.Job || 'مشارك'}`)
      .join('\n');
  };

  const handleSendToAllParticipants = async () => {
    if (!participants.length) {
      alert('لا يوجد مشاركين لإرسال الرسائل إليهم');
      return;
    }

    if (!window.confirm(`هل أنت متأكد من إرسال رسائل لجميع المشاركين (${participants.length} مشارك)؟`)) {
      return;
    }

    setIsSending(true);

    let successCount = 0;
    let failedList = [];

    for (let i = 0; i < participants.length; i++) {
      const participant = participants[i];
      let mobile = participant.Mobile.trim();
      if (!mobile.startsWith('+')) {
        mobile = `+${mobile}`;
      }

      const personalizedMessage = [
        `*أمر إسناد مهمة عمل*`,
        '',
        `مرحباً ${participant.Name}،`,
        '',
        `تم إسنادك للمهمة التالية:`,
        `🔢 رقم المهمة: ${mission.ID}`,
        `📋 اسم المهمة: ${mission.MissionName}`,
        `📅 التاريخ: ${formatDate(mission.Day, mission.Month, mission.Year)}`,
        `⏱️ المدة: ${mission.DurationDays} يوم / أيام`,
        `📞 رقم المنسق: ${mission.CoordinatorNum || 'غير محدد'}`,
        `👤 دورك: ${participant.Job || 'مشارك'}`,
        '',
        `نتمنى لكم التوفيق في أداء المهمة!`
      ].join('\n');

      try {
        const payload = {
          To: mobile,
          Text: personalizedMessage,
          Image: "/Users/mohanad/app/images/mission.jpg"
        };

        await api.post("/api/signal/send", payload, {
          timeout: 60000
        });

        successCount++;
      } catch (err) {
        console.error(`❌ فشل مع: ${participant.Name}`, err.response?.data || err.message);
        failedList.push(`${participant.Name} (${mobile})`);
      }

      if (i < participants.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    setIsSending(false);

    let finalMsg = `✅ تم إرسال ${successCount} رسالة بنجاح.`;
    if (failedList.length > 0) {
      finalMsg += `\n\n❌ فشل الإرسال لـ (${failedList.length}) مشارك:\n` + failedList.join('\n');
    }
    alert(finalMsg);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-dark-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !mission) {
    return (
      <div className="glass-card p-12 text-center space-y-6 max-w-2xl mx-auto mt-20">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center text-3xl mx-auto">
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        <h2 className="text-2xl font-black text-gray-800">حدث خطأ أثناء تحميل البيانات</h2>
        <p className="text-gray-400 font-bold">{error || 'لم يتم العثور على المهمة المطلوبة'}</p>
        <button onClick={() => navigate('/dashboard/missions')} className="px-8 py-3 bg-dark-green text-white rounded-2xl font-black">العودة للمهام</button>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start gap-6">
          <button
            onClick={() => navigate('/dashboard/missions')}
            className="w-14 h-14 glass-card flex items-center justify-center text-gray-600 hover:bg-dark-green hover:text-white transition-all duration-300 group shrink-0 mt-1"
          >
            <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
          </button>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-dark-green">
              <span className="px-3 py-1 rounded-lg bg-dark-green/10 text-[10px] font-black uppercase tracking-widest">مهمة رقم #{mission.ID}</span>
              <div className="w-1.5 h-6 bg-current rounded-full"></div>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-gray-800 leading-tight">{mission.MissionName}</h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-400">
              <div className="flex items-center gap-2">
                <i className="far fa-calendar-alt text-dark-green/60"></i>
                <span className="text-sm font-black text-gray-600 font-mono">{formatDate(mission.Day, mission.Month, mission.Year)}</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-gray-200"></span>
              <div className="flex items-center gap-2">
                <i className="far fa-clock text-blue-500/60"></i>
                <span className="text-sm font-black text-gray-600">المدة: {mission.DurationDays} أيام</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-gray-200"></span>
              <div className="flex items-center gap-2">
                <i className={`fas ${mission.Type === 'external' ? 'fa-globe-americas text-purple-500/60' : 'fa-building text-emerald-500/60'}`}></i>
                <span className="text-sm font-black text-gray-600">{mission.Type === 'external' ? 'مهمة خارجية' : 'مهمة داخلية'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 no-print">
          <button
            onClick={() => navigate(`/dashboard/missions/${id}/add-participants`)}
            className="px-8 py-4 bg-white text-dark-green border-2 border-dark-green/10 rounded-2xl font-black text-sm flex items-center gap-3 hover:bg-dark-green hover:text-white hover:border-dark-green transition-all shadow-lg active:scale-95"
          >
            <i className="fas fa-user-plus"></i>
            <span>إضافة مشاركين</span>
          </button>

          <div className="relative group">
            {mission.Status === 'completed' ? (
              <span className="inline-flex px-6 py-4 rounded-2xl text-xs font-black bg-green-50 text-green-700 border border-green-100 items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                مكتملة
              </span>
            ) : (
              <span className="inline-flex px-6 py-4 rounded-2xl text-xs font-black bg-blue-50 text-blue-700 border border-blue-100 items-center gap-2 shadow-lg shadow-blue-500/10">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                قيد التنفيذ
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {/* Mission Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-8 group overflow-hidden relative">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-dark-green/5 rounded-full blur-3xl group-hover:bg-dark-green/10 transition-colors"></div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-dark-green/5 text-dark-green rounded-2xl flex items-center justify-center text-xl shadow-inner">
                  <i className="fas fa-headset"></i>
                </div>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">إدارة التنسيق</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-gray-500 font-bold">رقم المنسق</span>
                  <span className="text-xl font-black text-gray-800 font-mono tracking-tighter">{mission.CoordinatorNum || '---'}</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-gray-500 font-bold">بواسطة</span>
                  <span className="text-sm font-black text-gray-800">{mission.CreatedByName || 'النظام'}</span>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 group overflow-hidden relative">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-500/5 text-blue-500 rounded-2xl flex items-center justify-center text-xl shadow-inner">
                  <i className="fas fa-users-cog"></i>
                </div>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">إحصائيات الموارد</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-gray-500 font-bold">إجمالي الفريق</span>
                  <span className="text-3xl font-black text-blue-600 tracking-tighter">{participants.length}</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-gray-500 font-bold">حالة التغطية</span>
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${participants.length > 0 ? 'bg-green-50 text-green-700' : 'bg-rose-50 text-rose-700'}`}>
                    {participants.length > 0 ? 'فريق مفعل' : 'لم يتم التعيين'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Participants Table */}
          <div className="glass-card overflow-hidden">
            <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-white/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                  <i className="fas fa-users"></i>
                </div>
                <h2 className="text-2xl font-black text-gray-800">أعضاء فريق العمل</h2>
              </div>
            </div>

            <div className="p-4">
              {participants.length > 0 ? (
                <div className="space-y-2">
                  {participants.map(participant => (
                    <div key={participant.ID} className="flex items-center justify-between p-6 rounded-3xl hover:bg-slate-50 transition-colors group">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-dark-green font-black shadow-sm">
                          {participant.Name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-black text-gray-800 group-hover:text-dark-green transition-colors">{participant.Name}</h4>
                          <div className="flex items-center gap-4 mt-1 text-[10px] font-bold text-gray-400">
                            <span className="flex items-center gap-1">
                              <i className="fas fa-id-badge opacity-50"></i>
                              {participant.Job === 'photo' ? 'مصور فوتو' : participant.Job === 'video' ? 'مصور فيديو' : participant.Job === 'reporter' ? 'مراسل' : participant.Job || 'عضو فريق'}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                            <span className="font-mono tracking-tight">{participant.Mobile}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveParticipant(participant.ID)}
                        className="w-10 h-10 rounded-xl text-rose-300 hover:bg-rose-50 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center shrink-0"
                        title="إزالة من الفريق"
                      >
                        <i className="fas fa-user-minus"></i>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                  <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-5xl">
                    <i className="fas fa-user-plus"></i>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-black text-gray-800">الفريق شاغر</p>
                    <p className="text-sm font-bold text-gray-400">ابدأ بإسناد الموظفين لتفعيل هذه المهمة</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          {/* Signal Broadcasting Card */}
          <div className="glass-card p-1 relative overflow-hidden group border-none shadow-2xl shadow-blue-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800"></div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="relative p-8 space-y-8 text-white">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-2xl">
                  <i className="fas fa-broadcast-tower animate-pulse"></i>
                </div>
                <div className="flex -space-x-3 rtl:space-x-reverse">
                  {participants.slice(0, 3).map((p, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border-2 border-blue-700 flex items-center justify-center text-[10px] font-black">
                      {p.Name.charAt(0)}
                    </div>
                  ))}
                  {participants.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-blue-700 flex items-center justify-center text-[10px] font-black">
                      +{participants.length - 3}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black mb-2">بث عبر Signal</h3>
                <p className="text-blue-100/70 text-sm font-bold leading-relaxed">إرسال أوامر الإسناد الشخصية لكافة أعضاء الفريق ضغطة واحدة وبشكل آلي.</p>
              </div>

              <div className="space-y-4 pt-4">
                <button
                  onClick={handleSendToAllParticipants}
                  disabled={participants.length === 0 || isSending}
                  className={`w-full py-5 rounded-[2rem] font-black text-lg flex items-center justify-center gap-4 transition-all shadow-xl active:scale-95 ${isSending || participants.length === 0
                      ? 'bg-blue-400/50 text-blue-200 cursor-not-allowed shadow-none'
                      : 'bg-white text-blue-700 hover:bg-blue-50 shadow-white/10'
                    }`}
                >
                  {isSending ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      <span>جاري البث...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      <span>إرسال لكافه الفريق</span>
                    </>
                  )}
                </button>
                <div className="flex items-center gap-3 justify-center opacity-60">
                  <i className="fas fa-shield-alt text-xs"></i>
                  <span className="text-[10px] font-black uppercase tracking-widest">تشفير كامل للأطراف</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="glass-card p-8 space-y-6">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">ملاحظات التوثيق</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100/50 flex gap-4">
                <i className="fas fa-info-circle text-amber-500 mt-1"></i>
                <p className="text-xs font-bold text-amber-800 leading-relaxed">يرجى التأكد من تسليم تقارير التوثيق في موعد أقصاه 24 ساعة من انتهاء المهمة.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                <i className="fas fa-history text-slate-400 mt-1"></i>
                <p className="text-xs font-bold text-slate-500 leading-relaxed">تم إنشاء هذه المهمة تلقائياً كجزء من خطة التغطية الربع سنوية.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


