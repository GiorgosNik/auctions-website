const express = require("express");
const app = express.Router();
const client = require("../database.js");
const jwt = require("jsonwebtoken");

app.post("/bid", async (req, res) => {
  try {
    const { account_id, auction_id } = req.body;

    const getRecommendations = () =>
      client.query(
        "SELECT * FROM recommendation_bid WHERE account_id = $1 AND auction_id = $2",
        [account_id, auction_id]
      );
    const { rows } = await getRecommendations();

    if (rows.length !== 0) {
      return res.status(409).json({ error: "Recommendation already exists" });
    } else {
      const newRecommendation = await client.query(
        "INSERT INTO recommendation_bid (account_id, auction_id) VALUES($1, $2) RETURNING *",
        [account_id, auction_id]
      );
      return res.status(201).json(newRecommendation.rows[0]);
    }
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/view", async (req, res) => {
  try {
    const { account_id, auction_id } = req.body;
    const getRecommendations = () =>
      client.query(
        "SELECT * FROM recommendation_view WHERE account_id = $1 AND auction_id = $2",
        [account_id, auction_id]
      );
    const { rows } = await getRecommendations();

    if (rows.length !== 0) {
      return res.status(409).json({ error: "Recommendation already exists" });
    } else {
      const newRecommendation = await client.query(
        "INSERT INTO recommendation_view (account_id, auction_id) VALUES($1, $2) RETURNING *",
        [account_id, auction_id]
      );
      return res.status(201).json(newRecommendation.rows[0]);
    }
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

app.get("/view/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const recommended = await client.query(
      "SELECT * FROM recommendation_view WHERE account_id =  $1",
      [id]
    );
    res.json(recommended.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.delete("/bid", async (req, res) => {
  try {
    await client.query("DELETE FROM recommendation_bid");
    res.json("Recommendations were deleted");
  } catch (error) {
    console.error(err.message);
  }
});

app.delete("/view", async (req, res) => {
  try {
    await client.query("DELETE FROM recommendation_view");
    res.json("Recommendations were deleted");
  } catch (error) {
    console.error(err.message);
  }
});

module.exports = app;
