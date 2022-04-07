CREATE DATABASE bidit;
\c bidit
CREATE TABLE account(
    id SERIAL PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    password VARCHAR(500) NOT NULL,
    firstname VARCHAR(30) NOT NULL,
    lastname VARCHAR(30) NOT NULL,
    email VARCHAR(30) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    country VARCHAR(30) NOT NULL,
    address VARCHAR(30) NOT NULL,
    postcode VARCHAR(5) NOT NULL,
    taxcode VARCHAR(15) NOT NULL,
    approved boolean NOT NULL
);

CREATE TABLE auction(
    id SERIAL PRIMARY KEY,
    item_name VARCHAR(30) NOT NULL,
    account_id INT REFERENCES account(id),
    description VARCHAR(500) NOT NULL,
    price_start NUMERIC NOT NULL,
    price_curr NUMERIC NOT NULL,
    price_inst NUMERIC,
    num_of_bids NUMERIC NOT NULL,
    started DATE NOT NULL,
    ends    DATE NOT NULL
);


CREATE TABLE bid(
    id SERIAL PRIMARY KEY,
    account_id INT REFERENCES account(id) ON DELETE CASCADE,
    auction_id INT REFERENCES auction(id) ON DELETE CASCADE,
    amount float NOT NULL,
    time timestamp
);

CREATE TABLE category(
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);
CREATE TABLE auction_category(
    id SERIAL PRIMARY KEY,
    auction_id INT REFERENCES auction(id) ON DELETE CASCADE,
    category_id INT REFERENCES category(id) ON DELETE CASCADE
);

CREATE TABLE newsletter(
    id SERIAL PRIMARY KEY,
    email VARCHAR(30)
);
