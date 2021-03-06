-- CREATE USER myUser;
-- CREATE DATABASE bidit;
-- GRANT ALL PRIVILEGES ON DATABASE myApp_dev TO myUser;
-- \c bidit
CREATE TABLE account(
    id SERIAL PRIMARY KEY,
    username VARCHAR(500) NOT NULL UNIQUE,
    password VARCHAR(500) NOT NULL,
    firstname VARCHAR(500) NOT NULL,
    lastname VARCHAR(500) NOT NULL,
    email VARCHAR(500) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    country VARCHAR(500) NOT NULL,
    city VARCHAR(500) NOT NULL,
    address VARCHAR(500),
    postcode VARCHAR(5) NOT NULL,
    taxcode VARCHAR(15) NOT NULL,
    approved boolean NOT NULL,
    sellerScore FLOAT,
    bidderScore FLOAT,
    sellerReviewCount INT,
    bidderReviewCount INT,
    messageCount INT NOT NULL
);

CREATE TABLE auction(
    id SERIAL PRIMARY KEY,
    auction_name VARCHAR(500) NOT NULL,
    account_id INT REFERENCES account(id) ON DELETE CASCADE
);

CREATE TABLE auction_item(
    id SERIAL PRIMARY KEY,
    item_name VARCHAR(500) NOT NULL,
    account_id INT REFERENCES account(id),
    description VARCHAR(20000) NOT NULL,
    price_start NUMERIC NOT NULL,
    price_curr NUMERIC NOT NULL,
    price_inst NUMERIC,
    num_of_bids NUMERIC NOT NULL,
    started timestamp,
    ends    timestamp,
    image VARCHAR(500),
    auction_id INT REFERENCES auction(id) ON DELETE CASCADE,
    message_sent boolean
);

CREATE TABLE product_view(
    id SERIAL PRIMARY KEY,
    auction_id INT REFERENCES auction_item(id) ON DELETE CASCADE,
    account_id INT REFERENCES account(id) ON DELETE CASCADE
);

CREATE TABLE bid(
    id SERIAL PRIMARY KEY,
    account_id INT REFERENCES account(id) ON DELETE CASCADE,
    auction_id INT REFERENCES auction_item(id) ON DELETE CASCADE,
    amount float NOT NULL,
    time timestamp
);

CREATE TABLE category(
    id SERIAL PRIMARY KEY,
    name VARCHAR(500) UNIQUE NOT NULL
);
CREATE TABLE auction_category(
    id SERIAL PRIMARY KEY,
    auction_id INT REFERENCES auction_item(id) ON DELETE CASCADE,
    category_id INT REFERENCES category(id) ON DELETE CASCADE
);

CREATE TABLE newsletter(
    id SERIAL PRIMARY KEY,
    email VARCHAR(30)
);

CREATE TABLE message(
    id SERIAL PRIMARY KEY,
    sender VARCHAR(30) REFERENCES account(username),
    receiver VARCHAR(30) REFERENCES account(username),
    text VARCHAR(500) NOT NULL,
    subject VARCHAR(100),
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recommendation_view(
    id SERIAL PRIMARY KEY,
    account_id INT REFERENCES account(id) ON DELETE CASCADE,
    auction_id INT REFERENCES auction_item(id) ON DELETE CASCADE
);

CREATE TABLE recommendation_bid(
    id SERIAL PRIMARY KEY,
    account_id INT REFERENCES account(id) ON DELETE CASCADE,
    auction_id INT REFERENCES auction_item(id) ON DELETE CASCADE
);