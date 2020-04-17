const User = require("../../models/User");
const clinic = require("../../models/clinic");
const doctor = require("../../models/doctor");
const passport = require("passport");

module.exports = (req, res, inClinic, type) => {
  e = req.body.email;
  f = req.body.fname;
  l = req.body.lname;
  c = req.body.confirm;
  p = req.body.password;
  n = req.body.number;
  if (n == "" || p == "" || f == "" || l == "" || e == "")
    return res.render("register", {
      e_msg: "Please fill all fields",
      expand: true,
      type: type
    });
  if (p != c)
    return res.render("register", {
      e_msg: "Passwords don't match",
      expand: true,
      type: type
    });
  if (!(/[A-Za-z]{1,15}/.test(f) | /[A-Za-z]{1,15}/.test(l)))
    return res.render("register", {
      e_msg: "Name is invalid",
      expand: true,
      type: type
    });
  if (!/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(e))
    return res.render("register", {
      e_msg: "Email is invalid",
      expand: true,
      type: type
    });
  if (!/[0]{1}[5]{1}[0-9]{8}/.test(n))
    return res.render("register", {
      e_msg: "Number is invalid",
      expand: true,
      type: type
    });
  if (p.length < 3)
    return res.render("register", {
      e_msg: "password is invalid",
      expand: true,
      type: type
    });
  var clinic_id = inClinic ? req.params.id : null;
  User.register(
    new User({
      email: e.toLowerCase(),
      lname: l,
      fname: f,
      type: type,
      numbers: n,
      status: "verified",
      clinic_id: clinic_id
    }),
    p,
    (err, _cb) => {
      if (err)
        res.render("register", {
          e_msg: "Email is already used",
          expand: true,
          type: type
        });
      else
        passport.authenticate("local")(req, res, () => {
          if (type == "receptionist")
            clinic.updateOne(
              { _id: req.params.id },
              { $set: { status: "active" } },
              (err, _cb) => {
                if (err) console.log(err);
                else
                  doctor.updateMany(
                    { clinic_id: req.params.id },
                    { $set: { status: "active" } },
                    (err, _cb) => {
                      if (err) console.log(err);
                      else res.redirect("/");
                    }
                  );
              }
            );
          else res.redirect("/");
        });
    }
  );
};
