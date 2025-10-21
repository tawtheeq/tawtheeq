-- name: AddUser :exec
INSERT INTO users (name, email, mobile, ) VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetUserByUsername :one
SELECT * FROM users WHERE username = $1;

-- name: GetAllUsers :many
SELECT * FROM users;

-- name: UpdateUser :exec
UPDATE users SET name = $1, email = $2, mobile = $3, password = $4 WHERE id = $5
RETURNING *;

-- name: DeleteUser :exec
DELETE FROM users WHERE id = $1;

-- name: GetUserByID :one
SELECT * FROM users WHERE id = $1;

-- name: CheckUserByUsername :one
SELECT EXISTS(SELECT 1 FROM users WHERE username = $1);

-- name: MakeUserAdmin :exec
UPDATE users SET role = 'admin' WHERE id = $1
RETURNING *;

-- name: RmoveUserAdmin :exec
UPDATE users SET role = 'user' WHERE id = $1
RETURNING *;

-- name: UpdatePassword :exec
UPDATE users SET password = $1 WHERE id = $2
RETURNING *;

-- name: UpdateBalance :exec
UPDATE users SET balance = $1 WHERE id = $2
RETURNING *;




    name
    username
    email
    mobile
    password
    balance
    created_at