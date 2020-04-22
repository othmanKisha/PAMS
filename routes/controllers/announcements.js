const announcement = require("../../models/announcement");
const date = require("date-and-time");

const getAnnouncements = (req, res) => {
  if (req.user.type != "admin") res.redirect("/");
  announcement.find({}, (err, annList) => {
    if (err) console.log(err);
    else
      res.render("admin", {
        data: annList,
        active: "announcements",
        title: "Announcements",
        page_type: "home",
        base: "/users/profile",
        base_page: "Profile"
      });
  });
};
const deleteAnnouncement = (req, res) => {
  if (req.user.type != "admin") res.redirect("/");
  announcement.deleteOne({ _id: req.params.id.substring(1) }, (err, _cb) => {
    if (err) console.log(err);
    else res.redirect("/announcements");
  });
};
const createAnnouncement = (req, res) => {
  if (req.user.type != "admin") res.redirect("/");
  else
    new announcement({
      content: req.body.content,
      date: date.format(new Date(), "MMMM DD, YYYY"),
      submitter: req.user.fname + " " + req.user.lname
    }).save((err, _cb) => {
      if (err) console.log(err);
      else res.redirect("/announcements");
    });
};
const getHome = (_req, res) => {
  announcement.find({}, (err, annList) => {
    if (err) res.json({});
    else res.json(annList);
  });
};

module.exports = {
  getAnnouncements,
  deleteAnnouncement,
  createAnnouncement,
  getHome
};
