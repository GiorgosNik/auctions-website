const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const https = require("https");
const fs = require("fs");
const auction = require("./modules/Auction");
const auth = require("./modules/Auth");
const bid = require("./modules/Bid");
const category = require("./modules/Category");
const message = require("./modules/Message");
const newsletter = require("./modules/Newsletter");
const view = require("./modules/View");
const xml = require("./modules/XML");
const recommendation = require("./modules/Recommendation");

const options = {
  key: fs.readFileSync(path.join(__dirname, "key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "cert.pem")),
};

app.use(cors());
app.use(express.json());
app.use("/auction", auction);
app.use("/auth", auth);
app.use("/view", view);
app.use("/bid", bid);
app.use("/category", category);
app.use("/messaging", message);
app.use("/newsletter", newsletter);
app.use("/xml", xml);
app.use("/recommendation", recommendation);
app.use("/images", express.static(path.join(__dirname, "./images")));

https.createServer(options, app).listen(5000);

// app.listen(5000, () => {
//   console.log("API listening at https://localhost:5000");
// });
