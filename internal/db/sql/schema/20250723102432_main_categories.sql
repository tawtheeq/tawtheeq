-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS  main_categories (
   id SERIAL PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL,
    description TEXT
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS main_categories;
-- +goose StatementEnd
