const client = require("../database.js");
const express = require("express");
const app = express.Router();
const { validateEmail, validateName } = require("./Validation.js");

// add newsletter email
app.post("/", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email cannot be blank" });
    }
    if (!validateEmail(email)) {
      return res
        .status(400)
        .json({ error: "You should provide a valid email address" });
    }
    if (email.length > 30) {
      return res.status(400).json({ error: "Email length is too long" });
    }
    await client.query(
      "SELECT * FROM newsletter WHERE email = $1",
      [email],
      function (err, result) {
        if (result.rows.length != 0) {
          return res.status(409).json({ error: "You have subscribed before" });
        } else {
          const newEmail = client.query(
            "INSERT INTO newsletter (email) VALUES($1) RETURNING *",
            [email]
          );
          return res.status(201).json(newEmail);
        }
      }
    );
  } catch (err) {
    console.error(err);
  }
});

// get all newsletter emails
app.get("/", async (req, res) => {
  try {
    const emails = await client.query("SELECT * FROM newsletter");
    res.json(emails.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// delete newsletter emails
app.delete("/", async (req, res) => {
  try {
    await client.query("DELETE FROM newsletter");
    res.json("Newsletter emails were deleted");
  } catch (error) {
    console.error(err.message);
  }
});

module.exports = app;
