-- name: AddUser :one
INSERT INTO users (name, email, mobile, password, role, balance)
VALUES ($1, $2, $3, $4, $5, $6)
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
    role = $5,
    balance = $6
WHERE id = $1
RETURNING *;


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
