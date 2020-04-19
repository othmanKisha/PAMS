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
        content: ""
      });
  });
};
const deleteAnnouncement = (req, res) => {
  if (req.user.type != "admin") res.redirect("/");
  announcement.deleteOne({ _id: req.params.id }, (err, _cb) => {
    if (err) console.log(err);
    else res.redirect("/");
  });
};
const createAnnouncement = (req, res) => {
  if (req.user.type != "admin") res.redirect("/");
  else
    new announcement({
      content: req.body.content,
      date: date.format(new Date(), "YY/MM/DD"),
      submitter: req.user.fname + " " + req.user.lname
    }).save((err, _cb) => {
      if (err) console.log(err);
      else res.redirect("/");
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
