-- name: CreateMission :one
INSERT INTO missions (
  mission_name,
  coordinator_num,
  main_category,
  sub_category,
  month,
  year,
  duration_days,
  created_by
) VALUES (
  $1, $2, $3, $4, $5, $6, $7, $8
)
RETURNING *;

-- name: GetAllMissions :many
SELECT 
  m.id,
  m.mission_name,
  m.coordinator_num,
  m.main_category,
  m.sub_category,
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
  m.coordinator_num,
  m.main_category,
  m.sub_category,
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
  coordinator_num = $2,
  main_category = $3,
  sub_category = $4,
  month = $5,
    year = $6,
    duration_days = $7
WHERE id = $8
RETURNING *;