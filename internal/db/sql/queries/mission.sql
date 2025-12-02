-- name: CreateMission :one
INSERT INTO missions (
  mission_name,
  coordinator_name,
  coordinator_num,
  main_category,
  sub_category,
  day,
  month,
  year,
  duration_days,
  created_by
) VALUES (
  $1, $2, $3, $4, $5, $6, $7, $8, $9 , $10
)
RETURNING *;

-- name: GetAllMissions :many
SELECT 
  m.id,
  m.mission_name,
  m.coordinator_name,
  m.coordinator_num,
  m.main_category,
  m.sub_category,
  m.day,
  m.month,
  m.year,
  m.duration_days,
  m.created_by,
  u.name AS created_by_name,
  m.created_at
FROM missions m
JOIN users u ON m.created_by = u.id
ORDER BY m.id DESC;

-- name: GetMissionByID :one
SELECT 
  m.id,
  m.mission_name,
  m.coordinator_name,
  m.coordinator_num,
  m.main_category,
  m.sub_category,
  m.day,
  m.month,
  m.year,
  m.duration_days,
  m.created_by,
  u.name AS created_by_name,
  m.created_at
FROM missions m
JOIN users u ON m.created_by = u.id
WHERE m.id = $1;

-- name: DeleteMission :exec
DELETE FROM missions WHERE id = $1;

-- name: UpdateMission :one
UPDATE missions
SET
  mission_name = $1,
  coordinator_name = $2,
  coordinator_num = $3,
  main_category = $4,
  sub_category = $5,
  day = $6,
  month = $7,
    year = $8,
    duration_days = $9
WHERE id = $10
RETURNING *;