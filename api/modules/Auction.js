const express = require("express");
const app = express.Router();
const client = require("../database.js");
const moment = require("moment");
var multer = require("multer");
const { query } = require("express");

var storage = multer.diskStorage({
  destination: "images/",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

//Auction
app.post("/", upload.any(), async (req, res) => {
  try {
    const {
      productName,
      accountId,
      productDescription,
      productCategories,
      startingPrice,
      buyOutPrice,
      auctionName,
    } = req.body;

    ////////////////// validate input //////////////////
    if (!productName) {
      return res.status(400).json({ error: "Product Name cannot be blank" });
    }
    if (!auctionName) {
      return res.status(400).json({ error: "Auction Name cannot be blank" });
    }
    if (productName.length > 30) {
      return res.status(400).json({ error: "Product Name length is too long" });
    }
    if (!accountId) {
      return res.status(400).json({ error: "Account Id cannot be blank" });
    }
    if (!productDescription) {
      return res.status(400).json({ error: "Description cannot be blank" });
    }
    if (productDescription.length > 500) {
      return res.status(400).json({ error: "Description length is too long" });
    }
    if (productCategories.length === 0) {
      return res.status(400).json({ error: "Category list cannot be blank" });
    }
    if (!startingPrice) {
      return res.status(400).json({ error: "Price cannot be blank" });
    }
    if (buyOutPrice) {
      if (parseInt(buyOutPrice) <= parseInt(startingPrice)) {
        console.log(buyOutPrice, startingPrice);
        return res.status(409).json({
          error: "Buyout Price cannot be lower than the Starting Price",
        });
      }
    }
    var newAuction;
    var productCategs = [];
    if (typeof productCategories === typeof "test") {
      productCategs.push(productCategories);
    } else {
      productCategs = productCategories;
    }
    // Check Categories Exist
    for (let i = 0; i < productCategs.length; i++) {
      try {
        const categories = await client.query(
          "SELECT * FROM category WHERE name = $1",
          [productCategs[i]]
        );
        if (categories.rows.length == 0) {
          return res.status(409).json({ error: "Category does not exist" });
        }
      } catch (err) {
        console.error(err.message);
      }
    }

    console.log(req.files);
    var concatenated_filepaths = "";
    for (let i = 0; i < req.files.length; i++) {
      var filepath = `https://localhost:5000/images/${req.files[i].originalname}`;
      if (i === 0) {
        concatenated_filepaths += filepath;
      } else {
        concatenated_filepaths += "," + filepath;
      }
    }

    var auction = await client.query(
      "SELECT * FROM auction WHERE auction_name = $1",
      [auctionName]
    );
    console.log(auction.rows);
    if (auction.rows.length === 0) {
      auction = await client.query(
        "INSERT INTO auction (auction_name, account_id) VALUES($1,$2) RETURNING *",
        [auctionName, accountId]
      );
    }
    console.log("ROWS ID", auction.rows[0].id);

    console.log(auction.rows[0]);
    const getUser = () =>
      client.query("SELECT * FROM account WHERE id = $1", [accountId]);
    const { rows } = await getUser();
    if (rows.length == 0) {
      return res.status(409).json({ error: "No such user" });
    } else {
      //////////////////////

      if (!buyOutPrice) {
        newAuction = await client.query(
          "INSERT INTO auction_item (item_name,account_id,description,price_start,price_curr,num_of_bids,image,auction_id, message_sent) VALUES($1,$2,$3,$4,$4,$5,$6,$7,false) RETURNING *",
          [
            productName,
            accountId,
            productDescription,
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
            productName,
            accountId,
            productDescription,
            startingPrice,
            buyOutPrice,
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
      console.log(newAuction.rows[0]);
      newAuction.rows[0].auction_id = auction.rows[0].id;
      return res.status(201).json(newAuction.rows[0]);
    }
  } catch (err) {
    console.error(err.message);
  }
});

app.put("/:id", async (req, res) => {
  try {
    const {
      productName,
      accountId,
      productDescription,
      productCategories,
      startingPrice,
      buyOutPrice,
      activate,
    } = req.body;
    const id = req.params.id;
    var updatedAuction;
    ////////////////// validate input //////////////////
    if (!productName) {
      return res.status(400).json({ error: "Product Name cannot be blank" });
    }
    if (productName.length > 30) {
      return res.status(400).json({ error: "Product Name length is too long" });
    }
    if (!accountId) {
      return res.status(400).json({ error: "Account Id cannot be blank" });
    }
    if (!productDescription) {
      return res.status(400).json({ error: "Description cannot be blank" });
    }
    if (productDescription.length > 500) {
      return res.status(400).json({ error: "Description length is too long" });
    }
    if (productCategories.length === 0) {
      return res.status(400).json({ error: "Category list cannot be blank" });
    }
    if (!startingPrice) {
      return res.status(400).json({ error: "Price cannot be blank" });
    }
    if (buyOutPrice) {
      if (parseInt(buyOutPrice) <= parseInt(startingPrice)) {
        return res
          .status(400)
          .json({ error: "Buyout price cannot be lower than starting price" });
      }
    }

    //Check Categories Exist
    for (let i = 0; i < productCategories.length; i++) {
      try {
        const categories = await client.query(
          "SELECT * FROM category WHERE name = $1",
          [productCategories[i]]
        );
        if (categories.rows.length == 0) {
          return res.status(409).json({ error: "Category does not exist" });
        }
      } catch (err) {
        console.error(err.message);
      }
    }

    //Set start and end times
    var started = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
    var ends = moment(Date.now()).add(3, "days").format("YYYY-MM-DD HH:mm:ss");

    const getUser = () =>
      client.query("SELECT * FROM account WHERE id = $1", [accountId]);
    const { rows } = await getUser();
    if (!activate) {
      if (rows.length === 0) {
        return res.status(409).json({ error: "No such user" });
      } else {
        if (buyOutPrice) {
          updatedAuction = await client.query(
            "UPDATE auction_item SET item_name = $1 ,description = $2, price_start = $3, price_inst = $4 WHERE id = $5 RETURNING *",
            [productName, productDescription, startingPrice, buyOutPrice, id]
          );
        } else {
          updatedAuction = await client.query(
            "UPDATE auction_item SET item_name = $1 ,description = $2, price_start = $3 , price_inst = NULL WHERE id = $4 RETURNING *",
            [productName, productDescription, startingPrice, id]
          );
        }

        updatedAuction.rows[0]["category"] = productCategories;
        await client.query(
          "DELETE from auction_category WHERE auction_id = $1 ",
          [updatedAuction.rows[0]["id"]]
        );
        for (let i = 0; i < productCategories.length; i++) {
          try {
            const categories = await client.query(
              "SELECT * FROM category WHERE name = $1",
              [productCategories[i]]
            );

            try {
              await client.query(
                "INSERT INTO auction_category (auction_id,category_id) VALUES($1,$2)",
                [updatedAuction.rows[0]["id"], categories.rows[0]["id"]]
              );
            } catch (err) {
              console.error(err.message);
            }
          } catch (err) {
            console.error(err.message);
          }
        }
        return res.status(201).json(updatedAuction.rows[0]);
      }
    } else {
      if (rows.length === 0) {
        return res.status(409).json({ error: "No such user" });
      } else {
        if (buyOutPrice) {
          updatedAuction = await client.query(
            "UPDATE auction_item SET item_name = $1 ,description = $2, price_start = $3, price_inst = $4, started = $5, ends = $6 WHERE id = $7 RETURNING *",
            [
              productName,
              productDescription,
              startingPrice,
              buyOutPrice,
              started,
              ends,
              id,
            ]
          );
        } else {
          updatedAuction = await client.query(
            "UPDATE auction_item SET item_name = $1 ,description = $2, price_start = $3,price_inst = NULL, started = $4, ends = $5 WHERE id = $6 RETURNING *",
            [productName, productDescription, startingPrice, started, ends, id]
          );
        }

        updatedAuction.rows[0]["category"] = productCategories;
        await client.query(
          "DELETE from auction_category WHERE auction_id = $1 ",
          [updatedAuction.rows[0]["id"]]
        );
        for (let i = 0; i < productCategories.length; i++) {
          try {
            const categories = await client.query(
              "SELECT * FROM category WHERE name = $1",
              [productCategories[i]]
            );

            try {
              await client.query(
                "INSERT INTO auction_category (auction_id,category_id) VALUES($1,$2)",
                [updatedAuction.rows[0]["id"], categories.rows[0]["id"]]
              );
            } catch (err) {
              console.error(err.message);
            }
          } catch (err) {
            console.error(err.message);
          }
        }
        return res.status(201).json(updatedAuction.rows[0]);
      }
    }
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/", async (req, res) => {
  try {
    var categories;
    const auctions = await client.query(
      "SELECT id, item_name, account_id, description, image, price_start, price_inst, price_curr, started, ends, num_of_bids FROM auction_item"
    );
    for (let auction_item of auctions.rows) {
      categories = await client.query(
        "SELECT name FROM auction_category INNER JOIN category ON (category.id = auction_category.category_id) WHERE auction_id =  $1",
        [auction_item.id]
      );
      bids = await client.query(
        "SELECT account_id, username, time, amount, city, country address FROM bid INNER JOIN account ON (account.id = bid.account_id) WHERE bid.auction_id =  $1",
        [auction_item.id]
      );
      auction_item.bids = bids.rows;
      user = await client.query("SELECT username FROM account WHERE id =  $1", [
        auction_item.account_id,
      ]);
      auction_item.username = user.rows[0].username;
    }
    res.json(auctions.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/maxprice", async (req, res) => {
  try {
    var time = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
    const maxPrice = await client.query(
      "SELECT MAX(price_curr) FROM (SELECT * FROM auction_item WHERE $1 < ends AND started IS NOT NULL AND (price_curr < price_inst OR price_inst IS NULL)) AS x ",
      [time]
    );
    res.json(maxPrice.rows[0].max);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/search", async (req, res) => {
  try {
    var terms = req.query.term;
    var auctions;
    var time = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
    if (terms.length === 0) {
      auctions = await client.query(
        "SELECT id, item_name, account_id, description, image, price_start, price_inst, price_curr, started, ends, num_of_bids FROM auction_item WHERE $1 < ends AND started IS NOT NULL AND (price_curr < price_inst OR price_inst IS NULL)",
        [time]
      );
    } else {
      terms = terms.split(" ").join(" & ");
      await client.query(
        "ALTER TABLE auction_item ADD COLUMN IF NOT EXISTS ts tsvector GENERATED ALWAYS AS ((setweight(to_tsvector('english', coalesce(description, '')), 'B'))) STORED"
      );
      await client.query(
        "CREATE INDEX IF NOT EXISTS ts_idx ON auction_item USING GIN (ts)"
      );

      auctions = await client.query(
        "SELECT * FROM auction_item WHERE ts @@ to_tsquery('english', $1) AND $2 < ends AND started IS NOT NULL AND (price_curr < price_inst OR price_inst IS NULL)",
        [terms, time]
      );
    }
    for (let auction_item of auctions.rows) {
      categories = await client.query(
        "SELECT name FROM auction_category INNER JOIN category ON (category.id = auction_category.category_id) WHERE auction_id =  $1",
        [auction_item.id]
      );
      auction_item.categories = categories.rows[0];
      user = await client.query("SELECT username FROM account WHERE id =  $1", [
        auction_item.account_id,
      ]);
      auction_item.username = user.rows[0].username;
    }
    res.json(auctions.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/myauction/", async (req, res) => {
  try {
    const id = req.query.accountId;
    const auction_id = req.query.auction_id;
    const auction_item = await client.query(
      "SELECT * FROM auction_item WHERE account_id = $1 AND auction_id = $2",
      [id, auction_id]
    );
    console.log(auction_item.rows, id, auction_id);
    res.json(auction_item.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/mycollections/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const collection = await client.query(
      "SELECT * FROM auction WHERE account_id = $1",
      [id]
    );
    res.json(collection.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/collections/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const collection = await client.query(
      "SELECT * FROM auction WHERE id = $1",
      [id]
    );
    res.json(collection.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/browse", async (req, res) => {
  var time = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
  const { categories, country, price } = req.query;
  const allCategories = categories.split(",");

  var result = [];

  var locationResult = [];
  if (country) {
    const productLocation = await client.query(
      "SELECT * FROM  account INNER JOIN auction_item ON (account.id = auction_item.account_id) WHERE country = $1 AND $2 < ends AND started IS NOT NULL AND (price_curr < price_inst OR price_inst IS NULL)",
      [country, time]
    );

    for (let i = 0; i < productLocation.rows.length; i++) {
      const productLocationCategories = await client.query(
        "SELECT name FROM auction_category INNER JOIN category ON (category.id = auction_category.category_id) WHERE auction_id = $1",
        [productLocation.rows[i].id]
      );
      productLocation.rows[i].categories = [];
      for (let k = 0; k < productLocationCategories.rows.length; k++) {
        productLocation.rows[i].categories.push(
          productLocationCategories.rows[k].name
        );
      }
    }
    locationResult = productLocation.rows;
  }
  var priceResult = [];
  if (price) {
    const productPrice = await client.query(
      "SELECT * FROM account INNER JOIN auction_item ON (account.id = auction_item.account_id) WHERE price_curr <=  $1 AND $2 < ends AND started IS NOT NULL AND (price_curr < price_inst OR price_inst IS NULL)",
      [price, time]
    );

    for (let i = 0; i < productPrice.rows.length; i++) {
      const productPriceCategories = await client.query(
        "SELECT name FROM auction_category INNER JOIN category ON (category.id = auction_category.category_id) WHERE auction_id = $1",
        [productPrice.rows[i].id]
      );
      productPrice.rows[i].categories = [];
      for (let k = 0; k < productPriceCategories.rows.length; k++) {
        productPrice.rows[i].categories.push(
          productPriceCategories.rows[k].name
        );
      }
    }
    priceResult = productPrice.rows;

    if (!country) {
      result = priceResult;
    } else if (priceResult.length === 0) {
      result = locationResult;
    } else {
      for (let i = 0; i < priceResult.length; i++) {
        for (let j = 0; j < locationResult.length; j++) {
          if (locationResult[j].id === priceResult[i].id) {
            result.push(locationResult[j]);
            break;
          }
        }
      }
    }
  }

  var finalResult = [];
  var categoriesResult = [];
  for (let i = 0; i < allCategories.length; i++) {
    // every selected category
    var auctionIds = await client.query(
      "SELECT auction_id FROM auction_category INNER JOIN category ON (category.id = auction_category.category_id) WHERE name =  $1",
      [allCategories[i]]
    );
    // get auctions of this category
    for (let i = 0; i < auctionIds.rows.length; i++) {
      var productCategories = await client.query(
        "SELECT * FROM auction_item WHERE id =  $1 AND $2 < ends AND started IS NOT NULL AND (price_curr < price_inst OR price_inst IS NULL)",
        [auctionIds.rows[i].auction_id, time]
      );
      categoriesResult.push(productCategories.rows);
    }
  }

  if (result.length === 0) {
    for (let i = 0; i < categoriesResult.length; i++) {
      if (categoriesResult[i].length === 0) {
        continue;
      }
      finalResult.push(categoriesResult[i][0]);
    }
  } else if (!categories) {
    finalResult = result;
  } else {
    for (let j = 0; j < result.length; j++) {
      for (let i = 0; i < categoriesResult.length; i++) {
        if (categoriesResult[i].length === 0) {
          continue;
        }
        if (categoriesResult[i][0].id === result[j].id) {
          finalResult.push(result[j]);
          break;
        }
      }
    }
  }

  console.log("finalResult = ", finalResult);

  try {
    res.json(finalResult);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const auction_item = await client.query(
      "SELECT * FROM auction_item WHERE id =  $1",
      [id]
    );
    const categories = await client.query(
      "SELECT name FROM auction_category INNER JOIN category ON (category.id = auction_category.category_id) WHERE auction_id =  $1",
      [id]
    );
    auction_item.rows[0].categories = [];
    for (let category of categories.rows) {
      auction_item.rows[0].categories.push(category.name);
    }
    const user = await client.query("SELECT * FROM account WHERE id =  $1", [
      auction_item.rows[0].account_id,
    ]);
    const auction_name = await client.query(
      "SELECT auction_name FROM auction WHERE id =  $1",
      [auction_item.rows[0].auction_id]
    );
    auction_item.rows[0].user = user.rows[0];
    auction_item.rows[0].auction_name = auction_name.rows[0].auction_name;
    res.json(auction_item.rows);
  } catch (err) {}
});

app.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await client.query("DELETE FROM auction_item WHERE id =  $1", [id]);
    res.json("Auction Deleted");
  } catch (err) {
    console.error(err.message);
  }
});

app.delete("/", async (req, res) => {
  try {
    await client.query("DELETE FROM auction_item");
    res.json("Auctions Deleted");
  } catch (error) {
    console.error(err.message);
  }
});

module.exports = app;
