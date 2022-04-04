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