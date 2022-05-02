const express = require("express");
const app = express.Router();
const client = require("../database.js");
const moment = require("moment");
var multer = require("multer");

var storage = multer.diskStorage({
  destination: "images/",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

//Auction
app.post("/", upload.single("file"), async (req, res) => {
  try {
    const {
      productName,
      accountId,
      productDescription,
      productCategories,
      startingPrice,
      buyOutPrice,
    } = req.body;

    ////////////////// validate input //////////////////
    var buyOut;
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
    if (buyOutPrice === "") {
      buyOut = "0";
    } else {
      buyOut = buyOutPrice;
    }
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

    const getUser = () =>
      client.query("SELECT * FROM account WHERE id = $1", [accountId]);
    const { rows } = await getUser();
    if (rows.length == 0) {
      return res.status(409).json({ error: "No such user" });
    } else {
      var filepath = null;
      if (req.file) {
        filepath = `http://localhost:5000/images/${req.file.originalname}`;
      }
      const newAuction = await client.query(
        "INSERT INTO auction (item_name,account_id,description,price_start,price_curr,price_inst,num_of_bids,image) VALUES($1,$2,$3,$4,$4,$5,$6,$7) RETURNING *",
        [
          productName,
          accountId,
          productDescription,
          startingPrice,
          buyOut,
          0,
          filepath,
        ]
      );
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
    ////////////////// validate input //////////////////
    var buyOut;
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
    if (buyOutPrice === "") {
      buyOut = "0";
    } else {
      if (buyOutPrice <= startingPrice) {
        return res
          .status(400)
          .json({ error: "Buyout price cannot be lower than starting price" });
      }
      buyOut = buyOutPrice;
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
    if (activate) {
      if (rows.length === 0) {
        return res.status(409).json({ error: "No such user" });
      } else {
        const updatedAuction = await client.query(
          "UPDATE auction SET item_name = $1 ,description = $2, price_start = $3, price_inst = $4, started = $5, ends = $6 WHERE id = $7 RETURNING *",
          [
            productName,
            productDescription,
            startingPrice,
            buyOut,
            started,
            ends,
            id,
          ]
        );

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
        console.log(updatedAuction.rows[0]);
        return res.status(201).json(updatedAuction.rows[0]);
      }
    } else {
      if (rows.length === 0) {
        return res.status(409).json({ error: "No such user" });
      } else {
        const updatedAuction = await client.query(
          "UPDATE auction SET item_name = $1 ,description = $2, price_start = $3, price_inst = $4 WHERE id = $5 RETURNING *",
          [productName, productDescription, startingPrice, buyOut, id]
        );

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
        console.log(updatedAuction.rows[0]);
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
      "SELECT id, item_name, account_id, description, image, price_start, price_inst, price_curr, started, ends, num_of_bids FROM auction"
    );
    for (let auction of auctions.rows) {
      categories = await client.query(
        "SELECT name FROM auction_category INNER JOIN category ON (category.id = auction_category.category_id) WHERE auction_id =  $1",
        [auction.id]
      );
      auction.categories = categories.rows[0];
      user = await client.query("SELECT username FROM account WHERE id =  $1", [
        auction.account_id,
      ]);
      auction.username = user.rows[0].username;
      console.log(auction.username);
    }
    res.json(auctions.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/search", async (req, res) => {
  try {
    var terms = req.query.term;
    var auctions;
    console.log(terms.length);
    if (terms.length === 0) {
      auctions = await client.query(
        "SELECT id, item_name, account_id, description, image, price_start, price_inst, price_curr, started, ends, num_of_bids FROM auction"
      );
    } else {
      terms = terms.split(" ").join(" & ");
      console.log(terms);
      await client.query(
        "ALTER TABLE auction ADD COLUMN IF NOT EXISTS ts tsvector GENERATED ALWAYS AS ((setweight(to_tsvector('english', coalesce(description, '')), 'B'))) STORED"
      );
      await client.query(
        "CREATE INDEX IF NOT EXISTS ts_idx ON auction USING GIN (ts)"
      );

      auctions = await client.query(
        "SELECT * FROM auction WHERE ts @@ to_tsquery('english', $1)",
        [terms]
      );
      console.log(auctions.rows);
    }
    for (let auction of auctions.rows) {
      categories = await client.query(
        "SELECT name FROM auction_category INNER JOIN category ON (category.id = auction_category.category_id) WHERE auction_id =  $1",
        [auction.id]
      );
      auction.categories = categories.rows[0];
      user = await client.query("SELECT username FROM account WHERE id =  $1", [
        auction.account_id,
      ]);
      auction.username = user.rows[0].username;
      console.log(auction.username);
    }
    res.json(auctions.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/myauctions/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const auction = await client.query(
      "SELECT * FROM auction WHERE account_id =  $1",
      [id]
    );
    console.log(auction.rows);
    res.json(auction.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const auction = await client.query("SELECT * FROM auction WHERE id =  $1", [
      id,
    ]);
    const categories = await client.query(
      "SELECT name FROM auction_category INNER JOIN category ON (category.id = auction_category.category_id) WHERE auction_id =  $1",
      [id]
    );
    auction.rows[0].categories = [];
    for (let category of categories.rows) {
      auction.rows[0].categories.push(category.name);
    }
    const user = await client.query("SELECT * FROM account WHERE id =  $1", [
      auction.rows[0].account_id,
    ]);
    auction.rows[0].user = user.rows[0];
    res.json(auction.rows);
  } catch (err) {}
});

app.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await client.query("DELETE FROM auction WHERE id =  $1", [id]);
    res.json("Auction Deleted");
  } catch (err) {
    console.error(err.message);
  }
});

app.delete("/", async (req, res) => {
  try {
    await client.query("DELETE FROM auction");
    res.json("Auctions Deleted");
  } catch (error) {
    console.error(err.message);
  }
});

module.exports = app;
