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
      // Note: The route uses {mid} and {pid}, but we'll use the standard format
      // If this doesn't work, the backend route may need to be fixed
      await axios.delete(`/api/missions/${id}/participants/${participantId}`);

      // Reload participants list from server
      const participantsRes = await axios.get(`/api/missions/${id}/participants`);
      setParticipants(participantsRes.data.data || []);

      alert('تم إزالة المشارك بنجاح!');
    } catch (err) {
      console.error('Error removing participant:', err);
      console.error("SERVER ERROR:", err.response?.data);
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

  if (loading) return <p>Loading mission details...</p>;
  if (error || !mission) return <p>Error: {error || 'Mission not found'}</p>;

  const formatParticipantsForShare = () => {
    if (!participants.length) return 'لا يوجد مشاركون حتى الآن.';
    return participants
      .map((participant, index) => `${index + 1}. ${participant.Name} - ${participant.Mobile} - ${participant.Job || 'مشارك'}`)
      .join('\n');
  };

  // const handleShareSignal = async () => {
  //   const shareText = [
  //     '*أمر إسناد مهمة عمل*',
  //     `اسم المهمة: ${mission.MissionName}`,
  //     `التاريخ: ${formatDate(mission.Day, mission.Month, mission.Year)}`,
  //     `المدة: ${mission.DurationDays} يوم / أيام`,
  //     `رقم المنسق: ${mission.CoordinatorNum || 'غير محدد'}`,
  //     '',
  //     '*فريق المهمة*',
  //     formatParticipantsForShare()
  //   ].join('\n');

  //   try {
  //     await axios.post("/api/signal/send", {
  //       // to: mission.CoordinatorNum,   // أو أي رقم تبغاه
  //       To: "+966507795131",
  //       Text: shareText,
  //       Image: "/Users/mohanad/app/images/mission.jpg"
  //     });

  //     alert("تم إرسال الرسالة عبر سيجنال بنجاح!");
  //   } catch (err) {
  //     console.error(err);
  //     alert("حدث خطأ أثناء الإرسال عبر سيجنال");
  //   }
  // };

  const handleSendToAllParticipants = async () => {
    if (!participants.length) {
      alert('لا يوجد مشاركين لإرسال الرسائل إليهم');
      return;
    }

    if (!window.confirm(`هل أنت متأكد من إرسال رسائل لجميع المشاركين (${participants.length} مشارك)؟`)) {
      return;
    }

    setIsSending(true);
    // إعداد متغيرات الحالة (يفضل أن تكون لديك حالة useState لرسالة التحميل)
    // setStatusMessage("بدء عملية الإرسال..."); 

    let successCount = 0;
    let failedList = [];

    for (let i = 0; i < participants.length; i++) {
      const participant = participants[i];

      // تحديث حالة العرض للمستخدم (مثلاً: إرسال 1 من 10)
      const currentProgress = `إرسال ${i + 1} من ${participants.length}: ${participant.Name}...`;
      console.log(currentProgress);
      // if (setStatusMessage) setStatusMessage(currentProgress);

      // 1. تنظيف وتنسيق رقم الجوال
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
          // Image: "mission.jpg" // نرسل اسم الملف فقط كما اتفقنا في كود Go المحدث
          Image: "/Users/mohanad/app/images/mission.jpg"
        };

        // 2. إرسال الطلب مع زيادة التايم أوت إلى 60 ثانية
        await axios.post("/api/signal/send", payload, {
          timeout: 60000 // 60 ثانية لكل طلب لضمان عدم الانقطاع
        });

        successCount++;

      } catch (err) {
        console.error(`❌ فشل مع: ${participant.Name}`, err.response?.data || err.message);
        failedList.push(`${participant.Name} (${mobile})`);
      }

      // 3. تأخير بسيط بين الرسائل (ثانيتين لضمان استقرار السيرفر وتجنب الحظر)
      if (i < participants.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    setIsSending(false);
    // if (setStatusMessage) setStatusMessage("");

    // رسالة نهائية تفصيلية
    let finalMsg = `✅ تم إرسال ${successCount} رسالة بنجاح.`;
    if (failedList.length > 0) {
      finalMsg += `\n\n❌ فشل الإرسال لـ (${failedList.length}) مشارك:\n` + failedList.join('\n');
    }
    alert(finalMsg);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{mission.MissionName}</h1>
          <br></br>
          <div className="flex items-center gap-3 mt-2 text-gray-500">
            <span className="flex items-center gap-1">
              <i className="fas fa-bullseye text-red-500"></i>
              رقم المهمة: {mission.ID}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>

            <span className="flex items-center gap-1">
              <i className="far fa-calendar-alt text-red-500"></i>
              {formatDate(mission.Day, mission.Month, mission.Year)}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>

            <span className="flex items-center gap-1">
              <i className="far fa-clock text-red-500"></i>
              مدة المهمة: {mission.DurationDays} يوم
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
            <span className="flex items-center gap-1">
              <i className="fas fa-tags text-red-500"></i>
              نوع المهمة: {mission.Type == 'external' ? 'خارجية' : 'داخلية'}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
            <span className="flex items-center gap-2">
              <i className="fas fa-crosshairs text-red-500"></i>
              حالة المهمة:
              {mission.status === 'completed' && (
                <span className="px-3 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">مكتملة</span>
              )}
              {mission.status === 'in_progress' && (
                <span className="px-3 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">قيد التنفيذ</span>
              )}
              {mission.status === 'cancelled' && (
                <span className="px-3 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">ملغاة</span>
              )}
              {mission.status === 'created' && (
                <span className="px-3 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-100">تم الإنشاء</span>
              )}
            </span>
          </div>
        </div>
        <div className="flex gap-3">

          <button
            className="flex items-center gap-2 px-4 py-2 bg-green-800 text-white rounded-xl hover:bg-green-900 transition-all shadow-md hover:shadow-lg"
            onClick={() => navigate(`/dashboard/missions/${id}/add-participants`)}
          >
            <i className="fas fa-user-plus"></i>
            <span>إضافة مشاركين</span>
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
            onClick={() => navigate(-1)}
          >
            <i className="fas fa-arrow-right"></i>
            <span>عودة</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Mission Stats */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">رقم المنسق</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">تمت الإضافة بواسطة</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">عدد المشاركين</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-6 py-4 text-gray-800 font-medium">{mission.CoordinatorNum || 'غير محدد'}</td>
                    <td className="px-6 py-4 text-gray-800">{mission.CreatedByName || 'غير محدد'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${participants.length > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {participants.length} مشارك
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Participants List */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/30">
              <h2 className="text-lg font-bold text-gray-800">المشاركون في المهمة</h2>
            </div>

            {participants.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">الاسم</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">الدور</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {participants.map(participant => (
                      <tr key={participant.ID} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-800">{participant.Name}</td>
                        <td className="px-6 py-4 text-gray-600">{participant.Job == 'photo' ? 'مصور فوتوغرافي' : participant.Job == 'video' ? 'مصور فيديو' : participant.Job == 'reporter' ? 'مراسل' : 'مشارك'}</td>
                        <td className="px-6 py-4">
                          <button
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-red-600 hover:bg-red-50 transition-colors"
                            onClick={() => handleRemoveParticipant(participant.ID)}
                            title="إزالة من المهمة"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                  <i className="fas fa-user-slash text-2xl"></i>
                </div>
                <p className="text-gray-500 mb-4">لا يوجد مشاركين في هذه المهمة</p>
                <button
                  className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                  onClick={() => navigate(`/dashboard/missions/${id}/add-participants`)}
                >
                  <i className="fas fa-user-plus ml-2"></i>
                  إضافة مشاركين
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Share Card */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-2xl shadow-xl p-6 text-white sticky top-6">
            <div className="flex items-center gap-3 mb-4 opacity-90">
              <i className="fas fa-share-alt"></i>
              <span className="text-sm font-medium">بطاقة المشاركة</span>
            </div>

            <h3 className="text-xl font-bold mb-2">{mission.MissionName}</h3>
            <p className="text-green-100 text-sm mb-6 leading-relaxed">
              {formatDate(mission.Day, mission.Month, mission.Year)} • {mission.DurationDays} يوم • {participants.length} مشارك
            </p>

            <div className="space-y-3 mb-8 text-sm text-green-50">
              <div className="flex justify-between border-b border-green-700/50 pb-2">
                <span>رقم المنسق:</span>
                <span className="font-mono">{mission.CoordinatorNum || 'غير محدد'}</span>
              </div>
              <div className="flex justify-between border-b border-green-700/50 pb-2">
                <span>تمت الإضافة بواسطة:</span>
                <span>{mission.CreatedByName || 'غير محدد'}</span>
              </div>
            </div>

            {/* <button
              className="w-full py-3 bg-white text-green-900 rounded-xl font-bold hover:bg-green-50 transition-all shadow-lg flex items-center justify-center gap-2 mb-3"
              onClick={handleShareSignal}
            >
              <i className="fas fa-paper-plane text-lg"></i>
              <span>إرسال عبر سيجنال</span>
            </button> */}

            <button
              className={`w-full py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 border-2 border-white/20 ${isSending || participants.length === 0
                ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                : 'bg-green-700 text-white hover:bg-green-600'
                }`}
              onClick={handleSendToAllParticipants}
              disabled={participants.length === 0 || isSending}
            >
              {isSending ? (
                <>
                  <i className="fas fa-spinner fa-spin text-lg"></i>
                  <span>جاري الإرسال...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-users text-lg"></i>
                  <span>إرسال لجميع المشاركين</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

