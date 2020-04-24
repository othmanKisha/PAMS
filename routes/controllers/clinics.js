const clinic = require("../../models/clinic");
const doctor = require("../../models/doctor");
const User = require("../../models/user");
const appointment = require("../../models/appointment");
const { sendPendingMail, sendConfirmationMail } = require("../helpers/mailing");

const getClinics = (req, res) => {
  if (req.user.type == "patient")
    clinic.find({ status: "active" }, (err, clinicList) => {
      if (err) console.log(err);
      else
        res.render(`patient`, {
          active: "clinics",
          data: clinicList,
          title: "Clinics Page",
          page_type: "home",
          base: "/users/profile",
          base_page: "Profile"
        });
    });
  else if (req.user.type == "admin")
    clinic.find({}, (err, clinicList) => {
      if (err) console.log(err);
      else
        res.render(`admin`, {
          active: "clinics",
          data: clinicList,
          title: "Clinics Page",
          page_type: "home",
          base: "/users/profile",
          base_page: "Profile"
        });
    });
  else
    res.render("error", {
      error: "Error: You are not autherized.",
      title: "Error",
      page_type: "show",
      base: "/users/profile",
      base_page: "Profile"
    });
};
const getClinicById = (req, res) => {
  var type = req.user.type;
  doctor.findOne({ clinic_id: req.params.id }, (err, doc) => {
    if (err) console.log(err);
    else if (!doc)
      clinic.findOne({ _id: req.params.id }, (err, clinicList) => {
        if (err) console.log(err);
        else if (type == "patient" && clinicList.status == "inactive")
          res.render("error", {
            error: "Error: There is no active clinic with this id.",
            title: "Error",
            page_type: "show",
            base: "/users/profile",
            base_page: "Profile"
          });
        else
          res.render("show", {
            data: clinicList,
            addData: null,
            active: "Clinic",
            user: type,
            doctors: "no",
            title: "Clinic Info",
            page_type: "show",
            base: "/users/profile",
            base_page: "Profile"
          });
      });
    else
      clinic.findOne({ _id: req.params.id }, (err, clinicList) => {
        if (err) console.log(err);
        else if (type == "patient" && clinicList.status == "inactive")
          res.render("error", {
            error: "Error: There is no active clinic with this id.",
            title: "Error",
            page_type: "show",
            base: "/users/profile",
            base_page: "Profile"
          });
        else
          doctor.find({ clinic_id: req.params.id }, (err, doctList) => {
            if (err) console.log(err);
            else
              res.render("show", {
                data: clinicList,
                addData: doctList,
                active: "Clinic",
                user: type,
                doctors: "yes",
                title: "Clinic Info",
                page_type: "show",
                base: "/users/profile",
                base_page: "Profile"
              });
          });
      });
  });
};
const getHome = (req, res) => {
  clinic.find({ status: "active" }, (err, clinicList) => {
    if (err) res.json({});
    else res.json(clinicList);
  });
};
const postClinic = (req, res) => {
  if (req.user.type != "admin")
    res.render("error", {
      error: "Error: You are not autherized.",
      title: "Error",
      page_type: "show",
      base: "/users/profile",
      base_page: "Profile"
    });
  else
    new clinic({
      name: req.body.name,
      profile: req.body.profile,
      services: req.body.services,
      numbers: req.body.numbers,
      email: req.body.email,
      location: req.body.location,
      website: req.body.website,
      appointments: 0,
      rating: -1,
      status: "inactive"
    }).save((err, cb) => {
      if (err) console.log(err);
      else res.redirect("/clinics");
    });
};
const editClinic = (req, res) => {
  if (req.user.type != "manager" && req.user.type != "patient")
    res.render("error", {
      error: "Error: You are not autherized.",
      title: "Error",
      page_type: "show",
      base: "/users/profile",
      base_page: "Profile"
    });
  else if (req.user.type == "patient")
    clinic.findOne({ _id: req.params.id }, (err, c) => {
      if (err) console.log(err);
      else
        clinic.updateOne(
          { _id: req.params.id },
          {
            $set: {
              rating: (
                (c.appointments * c.rating + Number(req.body.clinic_rating)) /
                (c.appointments + 1)
              ).toFixed(3)
            },
            $push: {
              reviews: ` Reviewer: ${req.user.fname} ${req.user.lname}, Rating: ${req.body.clinic_rating}, Review: ${req.body.clinic_review}`
            },
            $inc: {
              appointments: 1
            }
          },
          (err, _cb) => {
            if (err) console.log(err);
            else res.redirect("/");
          }
        );
    });
  else
    clinic.findOne({ _id: req.params.id }, (err, c) => {
      if (err) console.log(err);
      else if (c._id != req.user.clinic_id)
        res.render("error", {
          error: "Error: You are not autherized.",
          title: "Error",
          page_type: "show",
          base: "/users/profile",
          base_page: "Profile"
        });
      else
        clinic.updateOne(
          { _id: req.params.id },
          {
            $set: {
              name: req.body.name,
              profile: req.body.profile,
              services: req.body.services,
              numbers: req.body.numbers,
              email: req.body.email,
              location: req.body.location,
              website: req.body.website,
              status: req.body.status
            }
          },
          (err, _cb) => {
            if (err) console.log(err);
            else res.redirect(`/clinics/${req.params.id}`);
          }
        );
    });
};
const deleteClinic = (req, res) => {
  if (req.user.type != "admin")
    res.render("error", {
      error: "Error: You are not autherized.",
      title: "Error",
      page_type: "show",
      base: "/users/profile",
      base_page: "Profile"
    });
  else
    clinic.deleteOne({ _id: req.params.id }, (err, _cb) => {
      if (err) console.log(err);
      else
        User.deleteMany({ clinic_id: req.params.id }, (err, _cb) => {
          if (err) console.log(err);
          else
            doctor.deleteMany({ clinic_id: req.params.id }, (err, _cb) => {
              if (err) console.log(err);
              else
                appointment.deleteMany(
                  { clinic_id: req.params.id },
                  (err, _cb) => {
                    if (err) console.log(err);
                    else res.redirect("/clinics");
                  }
                );
            });
        });
    });
};

module.exports = {
  getClinics,
  getHome,
  getClinicById,
  postClinic,
  editClinic,
  deleteClinic
};
