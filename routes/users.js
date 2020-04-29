const express = require("express");
const User = require("../models/user");
const { checkAuth } = require("./middleware/auth");
const router = express.Router();

// REST routes for profile
router.get("/profile", checkAuth, (req, res) => {
  User.findOne({ _id: req.user._id }, (err, user) => {
    if (err) console.log(err);
    res.render("users/profile", {
      data: user,
      title: "Profile",
      page_type: "show",
      base: "/",
      base_page: "Dashboard"
    });
  });
});
router.put("/profile", checkAuth, async (req, res) => {
  // Maybe check for the password ??
  await User.updateOne(
    { _id: req.user._id },
    {
      $set: {
        numbers: req.body.numbers,
        fname: req.body.fname,
        lname: req.body.lname
      }
    }
  );
  res.redirect("/users/profile");
});

module.exports = router;
