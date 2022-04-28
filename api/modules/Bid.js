const express = require("express");
const app = express.Router();
const client = require("../database.js");

//Bid
app.post("/", async (req, res) => {
  try {
    const { account_id, auction_id, time, amount } = req.body;

    ////////////////// validate input //////////////////
    if (!account_id) {
      return res.status(400).json({ error: "account_id cannot be blank" });
    }
    if (!auction_id) {
      return res.status(400).json({ error: "auction_id cannot be blank" });
    }
    if (!time) {
      return res.status(400).json({ error: "Start time cannot be blank" });
    }
    if (!amount) {
      return res.status(400).json({ error: "amount cannot be blank" });
    }
    if (amount <= 0) {
      return res
        .status(400)
        .json({ error: "amount must be a positibe number" });
    }

    const getUser = () =>
      client.query("SELECT * FROM account WHERE id = $1", [account_id]);
    const { rows } = await getUser();
    if (rows.length == 0) {
      return res.status(409).json({ error: "No such user" });
    } else {
      const newBid = await client.query(
        "INSERT INTO bid (account_id,auction_id,amount,time) VALUES($1,$2,$3,$4) RETURNING *",
        [account_id, auction_id, amount, time]
      );
      console.log(newBid.rows[0]);
      return res.status(201).json(newBid.rows[0]);
    }
  } catch (err) {
    console.error(err.message);
  }
});

app.delete("/", async (req, res) => {
  try {
    await client.query("DELETE FROM bid");
    res.json("Bids Deleted");
  } catch (error) {
    console.error(err.message);
  }
});

app.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await client.query("DELETE FROM bid WHERE id =  $1", [id]);
    res.json("Bid Deleted");
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/", async (req, res) => {
  try {
    const bids = await client.query("SELECT * FROM bid");
    res.json(bids.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const bid = await client.query("SELECT * FROM bid WHERE id =  $1", [id]);
    res.json(bid.rows);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = app;
