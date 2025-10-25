-- +goose Up
-- +goose StatementBegin
CREATE TABLE missions (
    id SERIAL PRIMARY KEY,
    mission_name VARCHAR(255) NOT NULL,
    coordinator_num INT NOT NULL,
    main_category INT NOT NULL,
    sub_category INT NOT NULL,
    month INT NOT NULL,
    year INT NOT NULL,
    duration_days INT NOT NULL,
    created_by INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE missions;
-- +goose StatementEnd
