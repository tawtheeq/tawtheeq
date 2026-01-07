package handler

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"

	"github.com/maadiab/tawtheeq/tawtheeq/internal/response"
)

type RequestBody struct {
	To    string `json:"To"`
	Text  string `json:"Text"`
	Image string `json:"Image"` // optional
}

const sender = "+966533648253" // رقمك المسجل في Signal

func (h *Handler) SendMessage(w http.ResponseWriter, r *http.Request) {
	var data RequestBody
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		log.Println("Error decoding request body:", err)
		response.Error(w, 500, fmt.Sprintf("Signal error: %v", err))
		return
	}

	log.Printf("Received data - To: '%s', Text length: %d, Image: '%s'\n", data.To, len(data.Text), data.Image)

	// التحقق من وجود الرقم
	if data.To == "" {
		log.Println("Error: To field is empty")
		response.Error(w, 400, "Recipient phone number (To) is required")
		return
	}

	// بناء الأرجومنتات للأمر
	args := []string{"-u", sender, "send"}

	// إضافة نص الرسالة
	if data.Text != "" {
		args = append(args, "-m", data.Text)
	}

	// إضافة الصورة فقط إذا كانت موجودة على السيرفر
	if data.Image != "" {
		if _, err := os.Stat(data.Image); err == nil {
			args = append(args, "-a", data.Image)
		} else {
			log.Printf("Warning: Image file not found: %s, skipping attachment\n", data.Image)
		}
	}

	// الفصل بين الخيارات والمستلمين
	args = append(args, "--")

	// إضافة الرقم المستلم
	args = append(args, data.To)

	log.Println("COMMAND:", args)

	// تنفيذ الأمر
	cmd := exec.Command("signal-cli", args...)
	output, err := cmd.CombinedOutput()

	if err != nil {
		log.Printf("Signal-CLI Error: %v\nCommand: signal-cli %v\nOutput: %s\n", err, args, string(output))
		response.Error(w, 500, fmt.Sprintf("Signal error: %v, output: %s", err, string(output)))
		return
	}

	log.Printf("Signal-CLI Success. Output: %s\n", string(output))
	response.Success(w, "Message sent successfully", string(output))
}
