const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "cascatedemonte124";
const User = require("../models/User");

const requireLogin = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(422).json({ error: "You must be logged in" });
  }

  const token = authorization.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(422).json({ error: err });
    }
    const { id } = payload;
    User.findById({ _id: id }).then((userData) => {
      req.user = userData;
      next();
    });
  });
};

module.exports = requireLogin;
