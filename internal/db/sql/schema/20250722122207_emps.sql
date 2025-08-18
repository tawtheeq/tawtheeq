-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    delegationBalance INT NOT NULL DEFAULT 0,
);
-- +goose StatementEnd

-- +goose StatementBegin
CREATE TABLE leaves IF NOT EXISTS(
    id SERIAL PRIMARY KEY,
    employee_id INT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    leave_from DATE NOT NULL,
    leave_to DATE NOT NULL
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS employees;
-- +goose StatementEnd

-- +goose StatementBegin
DROP TABLE IF EXISTS leaves;
-- +goose StatementEnd
