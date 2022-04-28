const express = require("express");
const app = express.Router();
const client = require("../database.js");

//Auction
app.post("/", async (req, res) => {
  try {
    const {
      item_name,
      account_id,
      description,
      category,
      price_start,
      price_inst,
      started,
      ends,
    } = req.body;

    ////////////////// validate input //////////////////
    if (!item_name) {
      return res.status(400).json({ error: "Product Name cannot be blank" });
    }
    if (item_name.length > 30) {
      return res.status(400).json({ error: "Product Name length is too long" });
    }
    if (!account_id) {
      return res.status(400).json({ error: "Account Id cannot be blank" });
    }
    if (!description) {
      return res.status(400).json({ error: "Description cannot be blank" });
    }
    if (description.length > 500) {
      return res.status(400).json({ error: "Description length is too long" });
    }
    if (!category) {
      return res.status(400).json({ error: "Category list cannot be blank" });
    }
    if (!price_start) {
      return res.status(400).json({ error: "Price cannot be blank" });
    }
    if (!started) {
      return res.status(400).json({ error: "Start time cannot be blank" });
    }
    if (!ends) {
      return res.status(400).json({ error: "Start time cannot be blank" });
    }

    //Check Categories Exist
    for (let i = 0; i < category.length; i++) {
      try {
        const categories = await client.query(
          "SELECT * FROM category WHERE name = $1",
          [category[i]]
        );
        if (categories.rows.length == 0) {
          return res.status(409).json({ error: "Category does not exist" });
        }
      } catch (err) {
        console.error(err.message);
      }
    }

    //Check Start and End Date are correct
    var time = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
    if (time > started) {
      return res
        .status(409)
        .json({ error: "Cant have auction start in the past" });
    }
    if (ends < started) {
      return res
        .status(409)
        .json({ error: "Cant have auction end before it starts" });
    }

    const getUser = () =>
      client.query("SELECT * FROM account WHERE id = $1", [account_id]);
    const { rows } = await getUser();
    if (rows.length == 0) {
      return res.status(409).json({ error: "No such user" });
    } else {
      const newAuction = await client.query(
        "INSERT INTO auction (item_name,account_id,description,price_start,price_curr,price_inst,num_of_bids,started,ends) VALUES($1,$2,$3,$4,$4,$5,$6,$7,$8) RETURNING *",
        [
          item_name,
          account_id,
          description,
          price_start,
          price_inst,
          0,
          started,
          ends,
        ]
      );
      newAuction.rows[0]["category"] = category;
      for (let i = 0; i < category.length; i++) {
        try {
          const categories = await client.query(
            "SELECT * FROM category WHERE name = $1",
            [category[i]]
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

app.get("/", async (req, res) => {
  try {
    const auctions = await client.query("SELECT * FROM auction");
    res.json(auctions.rows);
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
    res.json(auction.rows);
  } catch (err) {
    console.error(err.message);
  }
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
