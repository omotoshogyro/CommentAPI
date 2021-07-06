const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const JWT_SECRET = "cascatedemonte124";
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(422).json({ error: "Please add all field" });
  }
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        return res.status(422).json({ error: "User already exists" });
      }

      bcrypt.hash(password, 12, (err, hashedPassword) => {
        if (err) {
          return res.status().json({ error: err });
        }

        const user = new User({
          name,
          email,
          password: hashedPassword,
        });
        user.save().then((savedUser) => {
          return res
            .status(200)
            .json({ message: "User saved sucessfully", user: savedUser });
        });
      });
    })
    .catch((err) => console.log(err));
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please add all fields" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (!savedUser) {
        return res.status(422).json({ error: "Incorrect password or email" });
      }

      bcrypt.compare(password, savedUser.password, (err, match) => {
        if (err) {
          return res.status().json({ error: err });
        }
        const token = jwt.sign({ id: savedUser._id }, JWT_SECRET);
        return res.status(422).json({ token });
      });
    })
    .catch((err) => console.log(err));
});

module.exports = router;
