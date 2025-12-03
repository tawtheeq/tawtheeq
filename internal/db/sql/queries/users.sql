-- name: AddUser :one
INSERT INTO users (name, email, mobile, job, role)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: GetUserByID :one
SELECT *
FROM users
WHERE id = $1;

-- name: GetUserByEmail :one
SELECT *
FROM users
WHERE email = $1;

-- name: GetUserByMobile :one
SELECT *
FROM users
WHERE mobile = $1;

-- name: GetAllUsers :many
SELECT *
FROM users
ORDER BY id;

-- name: UpdateUser :one
UPDATE users
SET name = $2,
    email = $3,
    mobile = $4,
    job = $5,   
    role = $6
WHERE id = $1
RETURNING *;


-- name: UpdateBasicInfo :exec
UPDATE users
SET name = $2,
    email = $3,
    mobile = $4,
    job = $5
WHERE id = $1;


-- name: DeleteUser :exec
DELETE FROM users
WHERE id = $1;

-- name: MakeUserAdmin :one
UPDATE users
SET role = 'admin'
WHERE id = $1
RETURNING *;

-- name: RemoveUserAdmin :one
UPDATE users
SET role = 'user'
WHERE id = $1
RETURNING *;

-- name: UpdatePassword :one
UPDATE users
SET password = $1
WHERE id = $2
RETURNING *;

-- name: UpdateBalance :one
UPDATE users
SET balance = $1
WHERE id = $2
RETURNING *;

-- name: CheckUserByEmail :one
SELECT EXISTS(SELECT 1 FROM users WHERE email = $1);

-- name: CheckUserByMobile :one
SELECT EXISTS(SELECT 1 FROM users WHERE mobile = $1);

-- name: GetUserWithLeaves :many
SELECT 
    u.id as user_id,
    u.name,
    u.email,
    l.id as leave_id,
    l.start_date,
    l.end_date,
    l.reason,
    l.created_at as leave_created_at
FROM users u
LEFT JOIN leaves l ON u.id = l.user_id
WHERE u.id = $1
ORDER BY l.start_date DESC;



-- name: GetUserWithSufficientBalance :many
SELECT *
FROM users
WHERE balance >= $1;