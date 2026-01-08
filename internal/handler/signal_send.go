package handler

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os" // أضفنا هذا للتحقق من وجود الملفات
	"os/exec"
	"strings"

	"github.com/maadiab/tawtheeq/tawtheeq/internal/response"
)

type RequestBody struct {
	To    string `json:"To"`
	Text  string `json:"Text"`
	Image string `json:"Image"`
}

const sender = "+966507795131"

func (h *Handler) SendMessage(w http.ResponseWriter, r *http.Request) {
	var data RequestBody
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		response.Error(w, 400, "Invalid JSON format")
		return
	}

	recipient := strings.TrimSpace(data.To)
	if recipient == "" {
		response.Error(w, 400, "Recipient phone number is required")
		return
	}
	if !strings.HasPrefix(recipient, "+") {
		recipient = "+" + recipient
	}

	// --- حل المشكلة رقم 2 و 3 ---

	args := []string{"-u", sender, "send"}

	if strings.TrimSpace(data.Text) != "" {
		args = append(args, "-m", data.Text)
	}

	// حل المشكلة رقم 3: التحقق من مسار الصورة بعناية
	if data.Image != "" {
		// نتحقق هل الملف موجود فعلياً على القرص في السيرفر
		if _, err := os.Stat(data.Image); err == nil {
			args = append(args, "-a", data.Image)
		} else {
			// إذا لم يجد الصورة، يسجل تحذير ويكمل إرسال النص فقط بدلاً من تعطل العملية كاملة
			log.Printf("⚠️ Warning: Image not found at path: %s. Sending text only.\n", data.Image)
		}
	}

	args = append(args, recipient)

	// تنفيذ الأمر
	cmd := exec.Command("signal-cli", args...)
	output, err := cmd.CombinedOutput()

	if err != nil {
		errorOutput := string(output)

		// حل المشكلة رقم 2: اكتشاف حظر الرسائل أو طلب الكابتشا
		if strings.Contains(errorOutput, "403") || strings.Contains(errorOutput, "Challenge") {
			log.Printf("🚨 RATE LIMIT/CAPTCHA DETECTED: %s\n", errorOutput)
			response.Error(w, 429, "Signal rate limit reached. Please wait or solve Captcha.")
			return
		}

		log.Printf("❌ Signal-CLI Error: %v\nOutput: %s\n", err, errorOutput)
		response.Error(w, 500, fmt.Sprintf("Signal error: %s", errorOutput))
		return
	}

	log.Printf("✅ Message sent to %s\n", recipient)
	response.Success(w, "Message sent successfully", nil)
}
