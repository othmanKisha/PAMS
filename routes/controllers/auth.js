const User = require("../../models/user");
const clinic = require("../../models/clinic");
const doctor = require("../../models/doctor");
const passport = require("passport");
const date = require("date-and-time");

//Login logic
const getLogin = (req, res) => {
  res.render("login", { e_msg: "", expand: false });
};
const login = (req, res) => {
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
};
//Register logic
const getRegister = (req, res) => {
  res.render("register", {
    e_msg: "",
    expand: false,
    route: `/auth/register`,
    type: "patient",
    id: null
  });
};
const register = (req, res, route, type, id) => {
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
      route: route,
      type: type,
      id: id
    });
  if (p != c)
    return res.render("register", {
      e_msg: "Passwords don't match",
      expand: true,
      route: route,
      type: type,
      id: id
    });
  if (!(/[A-Za-z]{1,15}/.test(f) | /[A-Za-z]{1,15}/.test(l)))
    return res.render("register", {
      e_msg: "Name is invalid",
      expand: true,
      route: route,
      type: type,
      id: id
    });
  if (!/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(e))
    return res.render("register", {
      e_msg: "Email is invalid",
      expand: true,
      route: route,
      type: type,
      id: id
    });
  if (!/[0]{1}[5]{1}[0-9]{8}/.test(n))
    return res.render("register", {
      e_msg: "Number is invalid",
      expand: true,
      route: route,
      type: type,
      id: id
    });
  if (p.length < 3)
    return res.render("register", {
      e_msg: "password is invalid",
      expand: true,
      route: route,
      type: type,
      id: id
    });
  User.register(
    new User({
      email: e.toLowerCase(),
      lname: l,
      fname: f,
      type: type,
      numbers: n,
      regDate: date.format(new Date(), "MMMM DD, YYYY"),
      status: "verified",
      clinic_id: id
    }),
    p,
    (err, _cb) => {
      if (err)
        res.render("register", {
          e_msg: "Email is already used",
          expand: true,
          route: route,
          type: type,
          id: id
        });
      else
        passport.authenticate("local")(req, res, () => {
          if (type == "receptionist")
            clinic.updateOne(
              { _id: id },
              { $set: { status: "active" } },
              (err, _cb) => {
                if (err) console.log(err);
                else
                  doctor.updateMany(
                    { clinic_id: id },
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
//signout
const signout = (req, res) => {
  req.logOut();
  res.redirect("/");
};

module.exports = { getLogin, login, getRegister, register, signout };
