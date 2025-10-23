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
  mp.role
FROM mission_participants mp
JOIN users u ON mp.user_id = u.id
WHERE mp.mission_id = $1
ORDER BY u.name;

-- name: DeleteParticipantsByMission :exec
DELETE FROM mission_participants WHERE mission_id = $1;
