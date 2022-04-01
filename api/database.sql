CREATE DATABASE bidit;
\c bidit
CREATE TABLE account(
    id SERIAL PRIMARY KEY,
    username VARCHAR(20),
    password VARCHAR(20),
    firstname VARCHAR(20),
    lastname VARCHAR(20),
    email VARCHAR(20),
    phone VARCHAR(15),
    country VARCHAR(20),
    address VARCHAR(30),
    postcode VARCHAR(5),
    taxcode VARCHAR(15),
    visitor boolean,
    approved boolean
);
CREATE TABLE newsletter(
    id SERIAL PRIMARY KEY,
    email VARCHAR(20)
);