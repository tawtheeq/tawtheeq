
export const validateSaudiPhone = (value) => {
    // تحويل الأرقام الهندية إلى عربية
    const arabicToLatin = {
        '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
        '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
    };

    let v = value.replace(/[٠-٩]/g, d => arabicToLatin[d]);

    // السماح فقط بالأرقام و +
    v = v.replace(/[^0-9+]/g, "");

    // -------- منطق صارم من البداية --------

    // لو كتب + فقط → ثبّت +966
    if (v === "+") {
        return "+966";
    }

    // منع أي رقم يبدأ بـ 0 غير 05
    if (v.startsWith("0") && v.length > 1 && !v.startsWith("05")) {
        return null; // رقم غير صالح
    }
    // لو بدأ بـ 05 → حوّله إلى +9665
    if (v.startsWith("05")) {
        v = "+966" + v.slice(1);
    }
    // لو بدأ بـ 5 مباشرة → حوّله إلى +9665
    else if (v.startsWith("5") && !v.startsWith("+966")) {
        v = "+966" + v;
    }
    // لو بدأ بـ +966
    if (v.startsWith("+966")) {
        // الرقم بعد +966 يجب أن يكون 5
        if (v.length > 4 && v[4] !== "5") {
            return null; // رقم غير صالح
        }

        // الحد الأقصى للطول +9665XXXXXXXX (13 رقم)
        if (v.length > 13) return null;

        return v;
    }
    // أي إدخال غير المسارات المسموحة (05 أو +9665)
    if (!v.startsWith("0") && !v.startsWith("+")) {
        return null;
    }
    return v;
};


export const usePhoneValidation = (setForm, form) => {
    return (e) => {
        const { name, value } = e.target;

        // لو الحقل ليس الجوال → تعامل عادي
        if (name !== "Mobile") {
            setForm({ ...form, [name]: value });
            return;
        }
        // استخدام دالة التحقق
        const validatedPhone = validateSaudiPhone(value);

        // لو الرقم صالح، حدّث الحقل
        if (validatedPhone !== null) {
            setForm({ ...form, Mobile: validatedPhone });
        }
        // لو الرقم غير صالح، لا تحدث الحقل (تجاهل الإدخال)
    };
};
