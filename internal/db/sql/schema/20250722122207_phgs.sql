-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS phgs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    missions_credit INT NOT NULL DEFAULT 0,
    start_vacation VARCHAR(255) NOT NULL DEFAULT '',
    end_vacation VARCHAR(255) NOT NULL DEFAULT '',
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    note TEXT
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS phgs;
-- +goose StatementEnd
