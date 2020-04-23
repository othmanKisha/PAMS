const clinic = require("../../models/clinic");
const doctor = require("../../models/doctor");
const User = require("../../models/user");
const appointment = require("../../models/appointment");

const getClinics = (req, res) => {
  if (req.user.type == "patient")
    clinic.find({ status: "active" }, (err, clinicList) => {
      if (err) console.log(err);
      else
        res.render(`patient`, {
          active: "clinics",
          data: clinicList,
          title: "Clinics",
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
          title: "Clinics",
          page_type: "home",
          base: "/users/profile",
          base_page: "Profile"
        });
    });
  else res.redirect("/");
};
const getClinicById = (req, res) => {
  var type = req.user.type;
  doctor.findOne({ clinic_id: req.params.id }, (err, doc) => {
    if (err) console.log(err);
    else if (!doc)
      clinic.findOne({ _id: req.params.id }, (err, clinicList) => {
        if (err) console.log(err);
        else if (type == "patient" && clinicList.status == "inactive")
          res.redirect("/clinics");
        else
          res.render("show", {
            data: clinicList,
            addData: null,
            active: "Clinic",
            user: type,
            doctors: "no",
            title: "Clinic",
            page_type: "show",
            base: "/users/profile",
            base_page: "Profile"
          });
      });
    else
      clinic.findOne({ _id: req.params.id }, (err, clinicList) => {
        if (err) console.log(err);
        else if (type == "patient" && clinicList.status == "inactive")
          res.redirect("/clinics");
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
                title: "Clinic",
                page_type: "show",
                base: "/users/profile",
                base_page: "Profile"
              });
          });
      });
  });
};
const getNewManager = (req, res) => {
  if (req.user.type != "admin") res.redirect("/");
  res.render("register", {
    e_msg: "",
    expand: false,
    route: `/clinics/${req.params.id}/manager`,
    type: "manager",
    id: req.params.id
  });
};
const getNewReceptionist = (req, res) => {
  if (req.user.type != "manager") res.redirect("/");
  res.render("register", {
    e_msg: "",
    expand: false,
    route: `/clinics/${req.params.id}/receptionist`,
    type: "receptionist",
    id: req.params.id
  });
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
  require("./registeration")(
    req,
    res,
    `/clinics/${req.params.id}/manager`,
    "manager",
    req.params.id
  );
};
const registerReceptionist = (req, res) => {
  if (req.user.type != "manager") res.redirect("/");
  require("./registeration")(
    req,
    res,
    `/clinics/${req.params.id}/receptionist`,
    "receptionist",
    req.params.id
  );
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
  clinic.deleteOne({ _id: req.params.id.substring(1) }, (err, _cb) => {
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
