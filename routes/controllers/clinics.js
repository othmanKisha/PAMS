const clinic = require("../../models/clinic");
const doctor = require("../../models/doctor");
const User = require("../../models/user");
const appointment = require("../../models/appointment");

const getClinics = (req, res) => {
  if (req.user.type == "patient")
    clinic.find({ status: "active" }, (err, clinicList) => {
      if (err) console.log(err);
      else res.render(`patient`, { active: "clinics", data: clinicList });
    });
  else if (req.user.type == "admin")
    clinic.find({}, (err, clinicList) => {
      if (err) console.log(err);
      else
        res.render(`admin`, {
          active: "clinics",
          data: clinicList,
          content: ""
        });
    });
  else res.redirect("/");
};
const getClinicById = (req, res) => {
  var type = req.params.type;
  clinic.aggregate(
    [
      { $match: { _id: req.params.id } },
      {
        $lookup: {
          from: doctor,
          localFeild: _id,
          foreignFeild: clinic_id,
          as: doctors
        }
      }
    ],
    (err, clinicList) => {
      if (err) console.log(err);
      else if (type == "patient" && clinicList.status == "inactive")
        res.redirect("/");
      else
        res.render("show", { data: clinicList, active: "Clinic", user: type });
    }
  );
};
const getNewManager = (req, res) => {
  if (req.user.type != "admin") res.redirect("/");
  res.render("register", { e_msg: "", expand: false, type: "manager" });
};
const getNewReceptionist = (req, res) => {
  if (req.user.type != "manager") res.redirect("/");
  res.render("register", { e_msg: "", expand: false, type: "receptionist" });
};
const getNewPage = (req, res) => {
  if (req.user.type != "admin") res.redirect("/");
  res.render("new", { edited: "clinics" });
};
const getEditPage = (req, res) => {
  if (req.user.type != "manager") res.redirect("/");
  res.render("edit", {});
};
const getHome = (req, res) => {
  clinic.find({ status: "active" }, (err, clinicList) => {
    if (err) res.json({});
    else res.json(clinicList);
  });
};
const registerManager = (req, res) => {
  if (req.user.type != "admin") res.redirect("/");
  require("./registeration")(req, res, true, "manager");
};
const registerReceptionist = (req, res) => {
  if (req.user.type != "manager") res.redirect("/");
  require("./registeration")(req, res, true, "receptionist");
};
const postClinic = (req, res) => {
  if (req.user.type != "admin") res.redirect("/");
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
  if (req.user.type != "manager") res.redirect("/");
  clinic.findOne({ _id: req.params.id }, (err, c) => {
    if (err) console.log(err);
    else if (c._id != req.user.clinic_id) res.redirect("/");
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
        else if (req.body.status == "inactive")
          doctor.updateMany(
            { clinic_id: req.params.id },
            { $set: { status: "inactive" } },
            (err, _cb) => {
              if (err) console.log(err);
              else res.redirect(`/clinics/:${req.params.id}`);
            }
          );
        else res.redirect(`/clinics/:${req.params.id}`);
      }
    );
  });
};
const deleteClinic = (req, res) => {
  if (req.user.type != "admin") res.redirect("/");
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
  getClinicById,
  getNewPage,
  getNewManager,
  getNewReceptionist,
  getEditPage,
  getHome,
  postClinic,
  registerManager,
  registerReceptionist,
  editClinic,
  deleteClinic
};
