-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS missions (
    id SERIAL PRIMARY KEY,
    mission_name VARCHAR(255) NOT NULL,
    phg_id1 INT NOT NULL,
    phg_id2 INT NOT NULL DEFAULT 0,
    phg_id3 INT NOT NULL DEFAULT 0,
    phg_id4 INT NOT NULL DEFAULT 0,
    phg_id5 INT NOT NULL DEFAULT 0,
    main_category INT NOT NULL,
    sub_category INT NOT NULL,
    month INT NOT NULL,
    year INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    number_of_phs INT NOT NULL DEFAULT 0,
    number_of_vids INT NOT NULL DEFAULT 0,
    description TEXT,
    created_by INT NOT NULL,
    status INT NOT NULL DEFAULT 1
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS missions;
-- +goose StatementEnd
