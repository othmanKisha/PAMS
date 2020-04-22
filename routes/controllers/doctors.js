const doctor = require("../../models/doctor");
const clinic = require("../../models/clinic");
const appointment = require("../../models/appointment");

const getDoctors = (req, res) => {
  if (req.user.type != "patient") res.redirect("/");
  doctor.find({ status: "active" }, (err, doctorList) => {
    if (err) console.log(err);
    else
      res.render("patient", {
        active: "doctors",
        data: doctorList,
        title: "Doctors",
        page_type: "home",
        base: "/users/profile",
        base_page: "Profile"
      });
  });
};
const getDoctorById = (req, res) => {
  var type = req.user.type;
  doctor.findOne({ _id: req.params.id }, (err, dr) => {
    if (err) console.log(err);
    else if (req.user.type == "patient" && dr.status != "active")
      res.redirect("/");
    else
      res.render("show", {
        data: dr,
        active: "Doctor",
        user: type,
        doctors: "",
        title: "Doctor",
        page_type: "show",
        base: "/users/profile",
        base_page: "Profile"
      });
  });
};
const getNewPage = (req, res) => {
  if (req.user.type != "manager") res.redirect("/");
  res.render("new", { edited: "doctors" });
};
const getEditPage = (req, res) => {
  if (req.user.type != "manager" || req.params.id != req.user.clinic_id)
    res.redirect("/");
  res.render("edit", {});
};
const getHome = (_req, res) => {
  doctor.find({ status: "active" }, (err, doctorList) => {
    if (err) res.json({});
    else res.json(doctorList);
  });
};
const postDoctor = (req, res) => {
  if (req.user.type != "manager" || req.params.id != req.user.clinic_id)
    res.redirect("/");
  clinic.findOne({ _id: req.user.clinic_id }, (err, c) => {
    if (err) console.log(err);
    else
      new doctor({
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        profile: req.body.profile,
        numbers: req.body.numbers,
        speciality: req.body.speciality,
        experience: req.body.experience,
        office: req.body.office,
        clinic_id: req.user.clinic_id,
        appointments: 0,
        rating: -1,
        status: c.status
      }).save((err, _cb) => {
        if (err) console.log(err);
        else res.redirect(`/clinics/:${req.user.clinic_id}`);
      });
  });
};
const createAppointment = (req, res) => {
  if (req.user.type != "patient") res.redirect("/");
  doctor.findOne({ _id: req.params.id, status: "active" }, (err, dr) => {
    if (err) console.log(err);
    else
      appointment.findOne(
        {
          doctor_id: req.params.id,
          date: req.body.data,
          time: req.body.time
        },
        (err, app) => {
          if (err) console.log(err);
          else if (!app)
            new appointment({
              date: req.body.date,
              time: req.body.time,
              reviewed: false,
              patient_id: req.user._id,
              doctor_id: req.params.id,
              clinic_id: dr.clinic_id,
              doctor_rating: 0,
              clinic_rating: 0
            }).save((err, _newApp) => {
              if (err) console.log(err);
              else res.redirect("/");
            });
          else res.redirect("/");
        }
      );
  });
};
const editDoctor = (req, res) => {
  if (req.user.type != "manager" || req.params.id != req.user.clinic_id)
    res.redirect("/");
  doctor.updateOne(
    { _id: req.params.id },
    {
      $set: {
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        profile: req.body.profile,
        numbers: req.body.numbers,
        speciality: req.body.speciality,
        experience: req.body.experience,
        office: req.body.office,
        status: req.body.status
      }
    },
    (err, _cb) => {
      if (err) console.log(err);
      else res.redirect(`/doctors/:${req.params.id}`);
    }
  );
};
const deleteDoctor = (req, res) => {
  if (req.user.type != "manager") res.redirect("/");
  doctor.deleteOne(
    {
      _id: req.params.id.substring(1),
      clinic_id: req.user.clinic_id.substring(1)
    },
    (err, _cb) => {
      if (err) console.log(err);
      else
        appointment.deleteOne(
          { doctor_id: req.params.id.substring(1) },
          (err, _cb) => {
            if (err) console.log(err);
            else res.redirect("/");
          }
        );
    }
  );
};

module.exports = {
  getDoctors,
  getDoctorById,
  getNewPage,
  postDoctor,
  createAppointment,
  getEditPage,
  editDoctor,
  deleteDoctor,
  getHome
};
