-- name: AddMissionParticipant :exec
INSERT INTO mission_participants (mission_id, user_id, role)
VALUES ($1, $2, $3)
ON CONFLICT (mission_id, user_id) DO NOTHING;

-- name: RemoveMissionParticipant :exec
DELETE FROM mission_participants
WHERE mission_id = $1 AND user_id = $2;

-- name: UpdateMissionParticipant :exec
UPDATE mission_participants
SET role = $3
WHERE mission_id = $1 AND user_id = $2;

-- name: GetMissionParticipants :many
SELECT 
  u.id,
  u.name,
  u.mobile,
  u.role,
  u.job,
  mp.role
FROM mission_participants mp
JOIN users u ON mp.user_id = u.id
WHERE mp.mission_id = $1
ORDER BY u.name;

-- name: DeleteParticipantsByMission :exec
DELETE FROM mission_participants WHERE mission_id = $1;


-- name: GetMissionsByParticipant :many
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
  m.type,
  m.duration_days,
  m.created_by,
  mp.role
FROM mission_participants mp
JOIN missions m ON mp.mission_id = m.id
WHERE mp.user_id = $1
ORDER BY m.year DESC, m.month DESC;


-- name: CheckUserLeaveConflict :one
SELECT EXISTS (
    SELECT 1 
    FROM leaves 
    WHERE user_id = $1
        AND (
            (start_date >= $2 AND start_date <= $3)
            OR
            (end_date >= $2 AND end_date <= $3)
            OR
            (start_date <= $2 AND end_date >= $3)
        )
) as has_conflict;