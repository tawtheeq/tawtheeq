-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS  sub_categories (
    id SERIAL PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL,
    description TEXT


);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS sub_categories;
-- +goose StatementEnd
