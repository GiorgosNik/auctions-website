const express = require("express");
const app = express.Router();
const client = require("../database.js");

// Category
app.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    ////////////////// validate input //////////////////
    if (!name) {
      return res.status(400).json({ error: "Category Name cannot be blank" });
    }
    if (name.length > 30) {
      return res
        .status(400)
        .json({ error: "Category Name length is too long" });
    }
    const getCategories = () =>
      client.query("SELECT * FROM category WHERE name = $1", [name]);
    const { rows } = await getCategories();
    if (rows.length != 0) {
      return res.status(409).json({
        error: "Category exists already. Please type an other category name",
      });
    } else {
      const newCat = await client.query(
        "INSERT INTO category (name) VALUES($1) RETURNING *",
        [name]
      );
      return res.status(201).json(newCat.rows[0]);
    }
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/", async (req, res) => {
  try {
    const categories = await client.query("SELECT * FROM category");
    res.json(categories.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const category = await client.query(
      "SELECT * FROM category WHERE id =  $1",
      [id]
    );
    res.json(category.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.delete("/", async (req, res) => {
  try {
    await client.query("DELETE FROM category");
    res.json("Categories Deleted");
  } catch (error) {
    console.error(err.message);
  }
});

app.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await client.query("DELETE FROM category WHERE id =  $1", [
      id,
    ]);
    res.json("Deleted Category");
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = app;
