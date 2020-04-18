const express = require("express");
const passport = require("passport");
const { checkAuth, checkNotAuth } = require("./middleware/auth");
const router = express.Router();

//Register logic
router.get("/register", checkNotAuth, (_req, res) => {
  res.render("register", { e_msg: "", expand: false, type: "patient" });
});
router.post("/register", (req, res) => {
  require("./controllers/registeration")(req, res, false, "patient");
});
//Login logic
router.get("/login", checkNotAuth, (_req, res) => {
  res.render("login", { e_msg: "", expand: false });
});
router.post("/login", (req, res) => {
  passport.authenticate("local", (err, user, _cb) => {
    if (err)
      return res.render("login", {
        e_msg: "Internal error, please try again later",
        expand: true
      });
    else if (!user)
      return res.render("login", {
        e_msg: "Please check your email and/or password",
        expand: true
      });
    else
      req.login(user, loginErr => {
        if (loginErr)
          return res.render("login", {
            e_msg: "Internal error, please try again later",
            expand: true
          });
        else res.redirect("/");
      });
  })(req, res);
});
//signout
router.get("/signout", checkAuth, (req, res) => {
  req.logOut();
  res.redirect("/");
});

module.exports = router;
