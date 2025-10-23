-- name: CreateCategory :one
INSERT INTO categories (category_name, category_type, description)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetCategoryByID :one
SELECT id, category_name, category_type, description
FROM categories
WHERE id = $1;

-- name: GetAllCategories :many
SELECT id, category_name, category_type, description
FROM categories
ORDER BY id;

-- name: GetMainCategories :many
SELECT id, category_name, description
FROM categories
WHERE category_type = 'main'
ORDER BY id;

-- name: GetSubCategories :many
SELECT id, category_name, description
FROM categories
WHERE category_type = 'sub'
ORDER BY id;

-- name: UpdateCategory :one
UPDATE categories
SET category_name = $2,
    category_type = $3,
    description = $4
WHERE id = $1
RETURNING *;

-- name: DeleteCategory :exec
DELETE FROM categories
WHERE id = $1;
