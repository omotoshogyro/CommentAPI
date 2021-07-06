const express = require("express");
const router = express.Router();
const Comments = require("../models/Comments");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const requireLogin = require("../middlewares/requireLogin");

router.get("/allcomment", (req, res) => {
  Comments.find()
    .populate("postedBy", "_id name email")
    .then((results) => {
      res.json(results);
    });
});

router.get("/mycomment", requireLogin, (req, res) => {
  Comments.find({ postedBy: req.user })
    .populate("postedBy", "_id name email")
    .then((myComments) => {
      return res.json(myComments);
    });
});

router.post("/comment", requireLogin, (req, res) => {
  const { comment } = req.body;

  req.user.password = undefined;
  Comments.find({ postedBy: req.user })
    .then((userComment) => {
      if (userComment[0]?.postedBy.toString() === req.user._id.toString()) {
        console.log(userComment[0]?.postedBy, req.user._id);
        return res.status(422).json({ error: "You can't comment twice" });
      }
      console.log(userComment[0]?.postedBy, req.user._id);
      // console.log("hello", userComment);

      const review = new Comments({
        comments: comment,
        postedBy: req.user,
      });
      review.save().then((result) => {
        return res.json({ message: "Saved Successfully", result });
      });
    })
    .catch((err) => console.log(err));
});

module.exports = router;
