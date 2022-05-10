const e = require("express");
const express = require("express");
const app = express.Router();
const client = require("../database.js");
const moment = require("moment");

// messaging
app.post("/:id", async (req, res) => {
  try {
    const senderId = req.params.id;

    const { subject, receiver, message } = req.body;
    if (!receiver) {
      return res.status(400).json({ error: "Receiver cannot be blank" });
    }
    if (!message) {
      return res.status(400).json({ error: "Message cannot be blank" });
    }
    if (receiver.length > 30) {
      return res.status(400).json({ error: "Receiver's username is too long" });
    }
    if (message.length > 500) {
      return res.status(400).json({ error: "Message is too long" });
    }
    if (subject.length > 100) {
      return res.status(400).json({ error: "Subject is too long" });
    }
    await client.query(
      "SELECT * FROM account WHERE id = $1",
      [senderId],
      function (err, result) {
        if (result.rows.length !== 0) {
          let sender = result.rows[0].username;
          const newMessage = client.query(
            "INSERT INTO message (subject, sender, receiver, text) VALUES($1, $2, $3, $4) RETURNING *",
            [subject, sender, receiver, message]
          );

          return res.status(201).json(newMessage);
        } else {
          return res.status(400).json({ error: "No such user exists" });
        }
      }
    );
  } catch (err) {
    console.error(err);
  }
});

app.post("/check/:id", async (req, res) => {
  try {
    const time = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
    const userId = req.params.id;
    var sender;
    var bids;
    var maxBid;
    var maxBidder;
    var subject;
    var message;
    const buyer = await client.query(
      "SELECT username FROM account WHERE id = $1",
      [userId]
    );
    const receiver = buyer.rows[0]["username"];

    const completedAuctions = await client.query(
      "SELECT * FROM auction_item WHERE ends < $1 AND message_sent = false",
      [time]
    );
    await client.query(
      "UPDATE auction_item SET message_sent = true WHERE ends < $1 AND message_sent = false",
      [time]
    );
    for (let auction of completedAuctions.rows) {
      sender = await client.query("SELECT * FROM account WHERE id = $1", [
        auction.account_id,
      ]);

      // Get all the bids
      bids = await client.query("SELECT * FROM bid WHERE account_id = $1", [
        userId,
      ]);

      maxBid = 0;
      // Get the max bid and max bidder
      for (let bid of bids.rows) {
        if (parseFloat(bid.amount) > parseFloat(maxBid)) {
          maxBid = bid.amount;
          maxBidder = bid.account_id;
        }
      }

      if (maxBidder === parseInt(userId)) {
        subject = "Auction Won";
        sender = sender.rows[0]["username"];
        message = "You won the auction on: " + auction["item_name"];

        const body = {
          subject,
          receiver,
          message,
        };
        const newMessage = client.query(
          "INSERT INTO message (subject, sender, receiver, text) VALUES($1, $2, $3, $4) RETURNING *",
          [subject, sender, receiver, message]
        );
      }
    }
    return res.json("");
  } catch (err) {
    console.error(err);
  }
});

app.get("/:id/inbox", async (req, res) => {
  try {
    const receiverId = req.params.id;

    await client.query(
      "SELECT * FROM account WHERE id = $1",
      [receiverId],
      function (err, result) {
        if (result && result.rows.length !== 0) {
          let receiver = result.rows[0].username;
          client.query(
            "SELECT * FROM message WHERE receiver = $1",
            [receiver],
            function (err, result) {
              if (result !== undefined) {
                return res.json(result.rows);
              }
              return res.json("");
            }
          );
        }
      }
    );
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/:id/sent", async (req, res) => {
  try {
    const senderId = req.params.id;

    await client.query(
      "SELECT * FROM account WHERE id = $1",
      [senderId],
      function (err, result) {
        if (result && result.rows.length !== 0) {
          let sender = result.rows[0].username;
          client.query(
            "SELECT * FROM message WHERE sender = $1",
            [sender],
            function (err, result) {
              if (result !== undefined) {
                return res.json(result.rows);
              } else {
                return res.json([]);
              }
            }
          );
        }
      }
    );
  } catch (err) {
    console.error(err.message);
  }
});
app.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const message = await client.query("SELECT * FROM message WHERE id = $1", [
      id,
    ]);
    res.json(message.rows);
  } catch (err) {
    console.error(err.message);
  }
});
// delete a message
app.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await client.query("DELETE FROM message WHERE id = $1", [id]);
    res.json("Message was deleted");
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = app;
