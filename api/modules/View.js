const express = require("express");
const app = express.Router();
const client = require("../database.js");

//View
app.post("/", async (req, res) => {
  try {
    const { account_id, auction_id } = req.body;

    ////////////////// validate input //////////////////
    if (!account_id) {
      return res.status(400).json({ error: "account_id cannot be blank" });
    }
    if (!auction_id) {
      return res.status(400).json({ error: "auction_id cannot be blank" });
    }

    const getUser = () =>
      client.query("SELECT * FROM account WHERE id = $1", [account_id]);
    const user = await getUser();
    const getAuction = () =>
      client.query("SELECT * FROM auction_item WHERE id = $1", [auction_id]);
    const auction_item = await getAuction();
    if (user.rows.length == 0) {
      return res.status(409).json({ error: "No such user" });
    } else if (auction_item.rows.length == 0) {
      return res.status(409).json({ error: "No such auction_item" });
    } else {
      console.log(account_id, auction_id);
      const newView = await client.query(
        "INSERT INTO product_view (account_id,auction_id) VALUES($1,$2) RETURNING *",
        [account_id, auction_id]
      );
      return res.status(201).json(newView.rows[0]);
    }
  } catch (err) {
    console.error(err.message);
  }
});

app.delete("/", async (req, res) => {
  try {
    console.log("TEST");
    await client.query("DELETE FROM product_view");
    res.json("Views Deleted");
  } catch (error) {
    console.error(err.message);
  }
});

app.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await client.query("DELETE FROM product_view WHERE id =  $1", [id]);
    res.json("View Deleted");
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/", async (req, res) => {
  try {
    const views = await client.query("SELECT * FROM product_view");
    res.json(views.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const view = await client.query(
      "SELECT * FROM product_view WHERE id =  $1",
      [id]
    );
    res.json(view.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/my/:id", async (req, res) => {
  try {
    const id = req.params.account_id;
    const view = await client.query(
      "SELECT * FROM product_view WHERE account_id =  $1",
      [id]
    );
    res.json(view.rows);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = app;
