-- name: AddUser :exec
INSERT INTO users (name, email, mobile, password) VALUES ($1, $2, $3, $4);
RETURNING *;

-- name: GetUserByUsername :one
SELECT * FROM users WHERE username = $1;

-- name: GetAllUsers :exec
SELECT * FROM users;

-- name: UpdateUser :exec
UPDATE users SET name = $1, email = $2, mobile = $3, password = $4 WHERE id = $5;
RETURNING *;

-- name: DeleteUser :exec
DELETE FROM users WHERE id = $1;

-- name: GetUserByID :one
SELECT * FROM users WHERE id = $1;

-- name: CheckUserByUsername :one
SELECT EXISTS(SELECT 1 FROM users WHERE username = $1);




