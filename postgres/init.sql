CREATE TYPE user_role AS ENUM (
    'USER',
    'ADMIN'
);

CREATE TABLE IF NOT EXISTS user_accounts (
    user_id         SERIAL PRIMARY KEY,
    username        varchar(30) NOT NULL,
    password_hash   char(60) NOT NULL,
    session_token   char(20),
    role            user_role NOT NULL DEFAULT 'USER'
);

CREATE TABLE IF NOT EXISTS teams (
    team_id         SERIAL PRIMARY KEY,
    name            varchar(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
    category_id     SERIAL PRIMARY KEY,
    title           varchar(15) NOT NULL
);

CREATE TABLE IF NOT EXISTS challenges (
    challenge_id    SERIAL PRIMARY KEY,
    category_id     SERIAL NOT NULL REFERENCES categories(category_id),
    value           int NOT NULL DEFAULT 0,
    title           varchar(30) NOT NULL,
    body            varchar(750) NOT NULL,
    attachments     varchar(100)[3]
);

CREATE TABLE IF NOT EXISTS announcements (
    announcement_id     SERIAL PRIMARY KEY,
    creation_date       timestamp NOT NULL,
    author_user_id      SERIAL NOT NULL REFERENCES user_accounts(user_id),
    body                varchar(1000) NOT NULL
);

CREATE TABLE IF NOT EXISTS scores (
    score_id            SERIAL PRIMARY KEY,
    team_id             SERIAL NOT NULL REFERENCES teams(team_id),
    challenge_id        SERIAL NOT NULL REFERENCES challenges(challenge_id),
    solve_date          timestamp NOT NULL
);