-- name: CreateLeave :one
INSERT INTO leaves (user_id, start_date, end_date, reason)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetLeaveByID :one
SELECT *
FROM leaves
WHERE id = $1;

-- name: GetLeavesByUser :many
SELECT *
FROM leaves
WHERE user_id = $1
ORDER BY start_date DESC;

-- name: GetAllLeaves :many
SELECT *
FROM leaves
ORDER BY start_date DESC;

-- name: UpdateLeave :one
UPDATE leaves
SET start_date = $2,
    end_date = $3,
    reason = $4,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;

-- name: DeleteLeave :exec
DELETE FROM leaves
WHERE id = $1;
