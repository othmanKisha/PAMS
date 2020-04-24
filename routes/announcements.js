const express = require("express");
const date = require("date-and-time");
const { checkAuth } = require("./middleware/auth");
const announcement = require("../models/announcement");
const router = express.Router();

// REST routes for announcements
router.get("/", checkAuth, (req, res) => {
  if (req.user.type != "admin")
    res.render("error", {
      error: "Error: You are not autherized.",
      title: "Error",
      page_type: "show",
      base: "/users/profile",
      base_page: "Profile"
    });
  else
    announcement.find({}, (err, annList) => {
      if (err) console.log(err);
      else
        res.render("admin", {
          data: annList,
          active: "announcements",
          title: "Announcements Page",
          page_type: "home",
          base: "/users/profile",
          base_page: "Profile"
        });
    });
});
router.delete("/:id", checkAuth, (req, res) => {
  if (req.user.type != "admin")
    res.render("error", {
      error: "Error: You are not autherized.",
      title: "Error",
      page_type: "show",
      base: "/users/profile",
      base_page: "Profile"
    });
  else
    announcement.deleteOne({ _id: req.params.id }, (err, _cb) => {
      if (err) console.log(err);
      else res.redirect("/announcements");
    });
});
router.post("/", checkAuth, (req, res) => {
  if (req.user.type != "admin")
    res.render("error", {
      error: "Error: You are not autherized.",
      title: "Error",
      page_type: "show",
      base: "/users/profile",
      base_page: "Profile"
    });
  else
    new announcement({
      content: req.body.content,
      date: date.format(new Date(), "MMMM DD, YYYY"),
      submitter: req.user.fname + " " + req.user.lname
    }).save((err, _cb) => {
      if (err) console.log(err);
      else res.redirect("/announcements");
    });
});
router.get("/Home", (_req, res) => {
  announcement.find({}, (err, annList) => {
    if (err) res.json({});
    else res.json(annList);
  });
});

module.exports = router;
