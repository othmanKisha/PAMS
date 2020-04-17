const express = require("express");
const User = require("../models/user");
const { checkAuth } = require("./middleware/auth");
const router = express.Router();

// REST routes for profile
router.get("/profile", checkAuth, (_req, res) => {
  User.findOne({ _id: req.user._id }, (err, user) => {
    if (err) console.log(err);
    res.render("profile", { data: user });
  });
});
router.put("/profile", checkAuth, (req, res) => {
  // Maybe check for the password ??
  User.updateOne(
    { _id: req.user._id },
    {
      $set: {
        email: req.body.email,
        numbers: req.body.numbers,
        fname: req.body.fname,
        lname: req.body.lname
      }
    },
    (err, _cb) => {
      if (err) console.log(err);
      else res.redirect("/users/profile");
    }
  );
});

module.exports = router;
