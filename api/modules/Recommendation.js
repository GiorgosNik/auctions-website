const express = require("express");
const app = express.Router();
const client = require("../database.js");
const jwt = require("jsonwebtoken");

app.post("/bid", async (req, res) => {
  try {
    const { account_id, auction_id } = req.body;
    const newRecommendation = await client.query(
      "INSERT INTO recommendation_bid (account_id, auction_id) VALUES($1, $2) RETURNING *",
      [account_id, auction_id]
    );
    return res.status(201).json(newRecommendation.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/views", async (req, res) => {
  try {
    const { account_id, auction_id } = req.body;
    const newRecommendation = await client.query(
      "INSERT INTO recommendation_view (account_id, auction_id) VALUES($1, $2) RETURNING *",
      [account_id, auction_id]
    );
    return res.status(201).json(newRecommendation.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/bid/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const recommended = await client.query(
      "SELECT * FROM recommendation_bid WHERE account_id =  $1",
      [id]
    );
    res.json(recommended.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/views/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const recommended = await client.query(
      "SELECT * FROM recommendation_views WHERE account_id =  $1",
      [id]
    );
    res.json(recommended.rows);
  } catch (err) {
    console.error(err.message);
  }
});
module.exports = app;
