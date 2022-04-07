CREATE DATABASE bidit;
\c bidit
CREATE TABLE account(
    id SERIAL PRIMARY KEY,
    username VARCHAR(30),
    password VARCHAR(500),
    firstname VARCHAR(30),
    lastname VARCHAR(30),
    email VARCHAR(30),
    phone VARCHAR(15),
    country VARCHAR(30),
    address VARCHAR(30),
    postcode VARCHAR(5),
    taxcode VARCHAR(15),
    approved boolean
);
CREATE TABLE newsletter(
    id SERIAL PRIMARY KEY,
    email VARCHAR(30)
);

CREATE TABLE message(
    id SERIAL PRIMARY KEY,
    sender INT REFERENCES account(id),
    receiver INT REFERENCES account(id),
    text VARCHAR(500) NOT NULL,
    subject VARCHAR(100),
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);