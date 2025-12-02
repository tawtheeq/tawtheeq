-- +goose Up
-- +goose StatementBegin
CREATE TABLE mission_participants (
    mission_id INT NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'participant',
    PRIMARY KEY (mission_id, user_id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE mission_participants;
-- +goose StatementEnd
