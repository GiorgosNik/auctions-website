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
    visitor boolean,
    approved boolean
);
CREATE TABLE newsletter(
    id SERIAL PRIMARY KEY,
    email VARCHAR(30)
);
INSERT INTO account(username, password, firstname, lastname, email, phone, country, address, postcode, taxcode, visitor, approved) 
VALUES('admin', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjQ4OTMyOTk3LCJleHAiOjE2NDg5NDAxOTd9.zah9T3VRxQTQJ62wAWVvMmhniOrSKnpow3wqFBW-ycc', null, null, null, null, null, null, null, null, null, null);

INSERT INTO account(username, password, firstname, lastname, email, phone, country, address, postcode, taxcode, visitor, approved) 
VALUES('nefeli', 'tavoul', 'sdfsfd', 'sfds', 'sfds@gmail.com', 'gfdg', 'gfdg', 'gfdg', 'gfdg', 'gfdg', false, false);