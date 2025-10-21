-- +goose Up
-- +goose StatementBegin
CREATE TABLE leaves (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE leaves;
-- +goose StatementEnd

