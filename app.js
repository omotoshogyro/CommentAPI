const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const postRoutes = require("./routes/Post");
const authRoutes = require("./routes/Auth");
const Comment = require("./models/Comments");

mongoose.connect("mongodb://localhost/test", {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("MongoDB Connected");
});

mongoose.connection.on("error", () => {
  console.log("MongoDB Error");
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(authRoutes);
app.use(postRoutes);

app.get("/", (req, res) => {
  res.json({ home: "This is the home page" });
});

app.listen(3000, () => {
  console.log("Server connected");
});
