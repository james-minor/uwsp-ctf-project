CREATE TYPE user_role AS ENUM (
    'USER',
    'ADMIN'
);

CREATE TABLE user_accounts (
    user_id         SERIAL PRIMARY KEY,
    username        varchar(30) NOT NULL,
    password_hash   char(60) NOT NULL,
    session_token   char(20),
    role            user_role NOT NULL DEFAULT 'USER'
);

CREATE TABLE teams (
    team_id         SERIAL PRIMARY KEY
);

CREATE TABLE categories (
    category_id     SERIAL PRIMARY KEY
);

CREATE TABLE challenges (
    challenge_id    SERIAL PRIMARY KEY
);