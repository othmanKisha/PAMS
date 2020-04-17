const announcement = require("../../models/announcement");
const date = require("date-and-time");

export const getAnnouncements = (req, res) => {
  if (req.user.type != "admin") res.redirect("/");
  announcement.find({}, (err, annList) => {
    if (err) console.log(err);
    else
      res.render("/users/admin", {
        data: annList,
        active: "announcements",
        content: ""
      });
  });
};
export const deleteAnnouncement = (req, res) => {
  if (req.user.type != "admin") res.redirect("/");
  announcement.deleteOne({ _id: req.params.id }, (err, _cb) => {
    if (err) console.log(err);
    else res.redirect("/");
  });
};
export const createAnnouncement = (req, res) => {
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
export const getHome = (_req, res) => {
  announcement.find({}, (err, annList) => {
    if (err) res.json({});
    else res.json(annList);
  });
};
