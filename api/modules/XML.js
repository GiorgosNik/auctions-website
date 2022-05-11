const express = require("express");
const app = express.Router();
var fs = require("file-system");
var inspect = require("util").inspect;
var parse = require("xml-parser");
const axios = require("axios");
const https = require("https");
const jwt = require("jwt-decode");
const { response } = require("express");

async function addUser(username, userDict) {
  const client = require("../database.js");
  const bcrypt = require("bcrypt");
  var password = "123456";
  var firstname = "John";
  var lastname = "Doe";
  var email = "test@test.com";
  var phone = "21098989898";
  var address = "";
  var postcode = "12345";
  var taxcode = "12345";
  try {
    const getAccounts = () =>
      client.query("SELECT * FROM account WHERE username = $1", [username]);
    const { rows } = await getAccounts();

    if (rows.length != 0) {
      return;
    } else {
      bcrypt.hash(password, 10, function (err, hash) {
        client.query(
          "INSERT INTO account (username, password, firstname, lastname, email, phone, country, city, address, postcode, taxcode, approved, sellerScore, bidderScore, sellerReviewCount, bidderReviewCount, messagecount) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *",
          [
            username,
            hash,
            firstname,
            lastname,
            email.toLowerCase(),
            phone,
            userDict["country"],
            userDict["city"],
            address,
            postcode,
            taxcode,
            true,
            0,
            0,
            0,
            0,
            0,
          ]
        );
      });
    }
  } catch (err) {
    return;
  }
}

async function addItem(Item) {
  const client = require("../database.js");
  var newAuction;
  var newCat;
  var productCategs = [];
  var accountId;
  var description = "";
  var bidder;
  var newBid;
  var bidAmmount;
  productCategs = Item["categories"];
  try {
    var startingPrice = Item["startingPrice"];
    var buyPrice;
    startingPrice = startingPrice.replace(",", "");
    if (Item["buyPrice"]) {
      var buyPrice = Item["buyPrice"];
      buyPrice = buyPrice.replace(",", "");
    }

    // If description does not exist, set null string
    if (Item["description"] != undefined) {
      description = Item["description"];
    }

    // Check Categories Exist
    for (let i = 0; i < productCategs.length; i++) {
      try {
        newCat = await client.query(
          "INSERT INTO category (name) VALUES($1) ON CONFLICT DO NOTHING RETURNING *",
          [productCategs[i]]
        );
      } catch (err) {
        console.error(err.message);
      }
    }
    var concatenated_filepaths = "";
    if (Item.files !== undefined) {
      for (let i = 0; i < Item.files.length; i++) {
        var filepath = `https://localhost:5000/images/${Item.files[i].originalname}`;
        if (i === 0) {
          concatenated_filepaths += filepath;
        } else {
          concatenated_filepaths += "," + filepath;
        }
      }
    }
    var auction = await client.query(
      "SELECT * FROM auction WHERE auction_name = $1",
      [Item["name"]]
    );
    var data = await client.query("SELECT * FROM account WHERE username = $1", [
      Item["seller"],
    ]);
    if (data.rows.length !== 0) {
      accountId = data.rows[0]["id"];
      if (auction.rows.length === 0) {
        auction = await client.query(
          "INSERT INTO auction (auction_name, account_id) VALUES($1,$2) RETURNING *",
          [Item["name"], accountId]
        );
      }

      if (!Item["buyPrice"]) {
        newAuction = await client.query(
          "INSERT INTO auction_item (item_name,account_id,description,price_start,price_curr,num_of_bids,image,auction_id, message_sent) VALUES($1,$2,$3,$4,$4,$5,$6,$7,false) RETURNING *",
          [
            Item["name"],
            accountId,
            description,
            startingPrice,
            0,
            concatenated_filepaths,
            auction.rows[0].id,
          ]
        );
      } else {
        newAuction = await client.query(
          "INSERT INTO auction_item (item_name,account_id,description,price_start,price_curr,price_inst,num_of_bids,image,auction_id, message_sent) VALUES($1,$2,$3,$4,$4,$5,$6,$7,$8, false) RETURNING *",
          [
            Item["name"],
            accountId,
            description,
            startingPrice,
            buyPrice,
            0,
            concatenated_filepaths,
            auction.rows[0].id,
          ]
        );
      }

      newAuction.rows[0]["category"] = productCategs;
      for (let i = 0; i < productCategs.length; i++) {
        try {
          const categories = await client.query(
            "SELECT * FROM category WHERE name = $1",
            [productCategs[i]]
          );
          try {
            await client.query(
              "INSERT INTO auction_category (auction_id,category_id) VALUES($1,$2)",
              [newAuction.rows[0]["id"], categories.rows[0]["id"]]
            );
          } catch (err) {
            console.error(err.message);
          }
        } catch (err) {
          console.error(err.message);
        }
      }

      var numbOfBids = 0;
      for (let bid of Item["bids"]) {
        // Get the bidder
        bidder = await client.query(
          "SELECT * FROM account WHERE username = $1",
          [bid["bidder"]]
        );

        // Add the bid to the table
        bidAmmount = bid["ammount"].slice(1).replace(",", "");
        newBid = await client.query(
          "INSERT INTO bid (account_id,auction_id,amount,time) VALUES($1,$2,$3,$4) RETURNING *",
          [
            bidder.rows[0]["id"],
            newAuction.rows[0]["id"],
            bidAmmount,
            bid["time"],
          ]
        );

        // Increase the bid count by one
        await client.query(
          "UPDATE auction_item SET price_curr = $1, num_of_bids = $2 WHERE id = $3",
          [bidAmmount, numbOfBids + 1, newAuction.rows[0]["id"]]
        );
        numbOfBids = numbOfBids + 1;
      }
    }

    return;
  } catch (err) {
    console.error(err);
    throw "Item Exists";
  }
}

app.get("/", async (req, res) => {
  try {
    var xml;
    var obj;
    var users = {};
    var products = {};
    var categories;
    var userId;
    var userLocation;
    var userCountry;

    var description;
    var buyPrice;
    var firstPrice;
    var name;
    var bids;
    var items = [];
    var accountId;
    var bidderName;
    var bidderLocation;
    var bidderCountry;
    var bidTime;
    var bidAmmount;
    var productBids;
    var startTime;
    var endTime;
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
      cert: fs.readFileSync("./cert.pem"),
      key: fs.readFileSync("./key.pem"),
      passphrase: "YYY",
    });

    for (i = 0; i < 1; i++) {
      xml = fs.readFileSync(
        "./ebay-data/items-" + i.toString() + ".xml",
        "utf8"
      );
      obj = parse(xml);

      var num = 0;
      // Loop for each item
      for (let item of obj["root"].children) {
        categories = [];
        buyPrice = null;
        productBids = [];
        userId = item["attributes"]["ItemID"];

        // Loop for item attributes
        for (let attribute of item.children) {
          if (attribute.name === "Seller") {
            userId = attribute["attributes"]["UserID"];
          }
          if (attribute.name === "Location") {
            userLocation = attribute["content"];
          }
          if (attribute.name === "Country") {
            userCountry = attribute["content"];
          }
          if (attribute.name === "Bids") {
            bids = attribute["children"];

            // Loop for each bid
            for (let bid of bids) {
              // Loop for each attribute of each bid
              for (let bid_attribute of bid.children) {
                // Get bidder details
                if (bid_attribute.name === "Bidder") {
                  bidderName = bid_attribute["attributes"]["UserID"];
                  if (bid_attribute["children"][0] !== undefined) {
                    bidderLocation = bid_attribute["children"][0]["content"];
                  } else {
                    bidderLocation = "unknown";
                  }
                  if (bid_attribute["children"][1] !== undefined) {
                    bidderCountry = bid_attribute["children"][1];
                  } else {
                    bidderCountry = "unknown";
                  }
                  // Push back bidder user
                  users[bidderName] = {
                    country: bidderCountry,
                    city: bidderLocation,
                  };
                }
                if (bid_attribute.name === "Amount") {
                  bidAmmount = bid_attribute.content;
                }
                if (bid_attribute.name === "Time") {
                  bidTime = bid_attribute.content;
                }
              }
              productBids.push({
                bidder: bidderName,
                time: bidTime,
                ammount: bidAmmount,
              });
            }
          }
          if (attribute.name === "Category") {
            categories.push(attribute["content"]);
          }
          if (attribute.name === "First_Bid") {
            firstPrice = attribute["content"];
            firstPrice = firstPrice.slice(1);
          }
          if (attribute.name === "Name") {
            name = attribute["content"];
          }
          if (attribute.name === "Buy_Price") {
            buyPrice = attribute["content"];
            buyPrice = buyPrice.slice(1);
          }
          if (attribute.name === "Description") {
            description = attribute["content"];
          }
          if (attribute.name === "Started") {
            startTime = attribute["content"];
          }
          if (attribute.name === "Ends") {
            endTime = attribute["content"];
          }
        }

        // Push back the item
        items.push({
          name: name,
          description: description,
          categories: categories,
          seller: userId,
          buyPrice: buyPrice,
          startingPrice: firstPrice,
          bids: productBids,
          started: startTime,
          ends: endTime,
        });

        // Push back selller user
        users[userId] = { country: userCountry, city: userLocation };
        num++;
        if (num === 20) {
          break;
        }
      }
    }
    num = 0;
    // Loop to add users to db
    for (let user of Object.keys(users)) {
      num++;
      if (num === 20) {
        break;
      }
      try {
        await addUser(user, users[user]);
      } catch {
        console.error(err.message);
      }
    }
    // Loop to add items to db
    var i = 0;
    for (let item of items) {
      try {
        i = i + 1;
        if (i === 20) {
          break;
        }
        await addItem(item);
      } catch {
        console.error(err);
      }
    }
    res.json("");
  } catch (err) {
    console.error(err);
  }
});

module.exports = app;
