const express = require("express");
const app = express.Router();
const client = require("../database.js");
const jwt = require("jsonwebtoken");

app.post("/", async (req, res) => {
  //   try {
  //     const { name } = req.body;
  //     const newCat = await client.query(
  //       "INSERT INTO category (name) VALUES($1) RETURNING *",
  //       [name]
  //     );
  //     return res.status(201).json(newCat.rows[0]);
  //   } catch (err) {
  //     console.error(err.message);
  //   }
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
