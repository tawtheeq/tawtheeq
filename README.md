## TAWTHEEQ:
### ISSUES:
- UPLOADING PHOTOS ONLINE (NOT IN BASE SYSTEM)
### 
- الإجازات 
- المهام
- مناوبات
- دورات
- متواجد
- تغطية 
- انتهاء رصيد الانتداب

### EVENTS
- WHERE
- DATE
- PHOTOGRAPHER
- MOBILE FOR AND NAME
- ADDRESS
- NOTES
- CREATED BY
- PRINT PDF

### DATAFLOW
- DATA ENTRY
- SEND TO PHOTOGRAPHER BY WHATSAPP
- 


###  DATABASE TABLES
- users 
- vacations
- categories
- missions




  ### LOGIC
  - LOGIN BY ADMIN
  - ADD USERS INFO (BALANCE, LEAVES, ETC)
  - ADD MISSION (CHECK USER BALANCES, LEAVES)
  - UPDATE BALANCES AFTER THAT.
  - CREATE MISSION PDF CARD.
  - SEND THIS CARD TO A PHOTOGRAPHERS BY WHATSAPP.
  - SEND A JSON PAYLOAD WITH A MISSION DATA TO ARCHIVE SOFTWARE.



### RUNNING BACKEND

export $(grep -v '^#' .env | xargs) && goose -dir ./migrations postgres "user=$DB_USER password=$DB_PASSWORD host=$DB_HOST port=$DB_PORT dbname=$DB_NAME sslmode=$DB_SSLMODE" up



