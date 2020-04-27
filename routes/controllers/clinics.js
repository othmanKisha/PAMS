const clinic = require("../../models/clinic");
const doctor = require("../../models/doctor");
const User = require("../../models/user");
const appointment = require("../../models/appointment");
const rate = require("../helpers/rate");

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
const getNewPage = (req, res) => {
  if (req.user.type != "admin")
    res.render("error", {
      error: "Error: You are not autherized.",
      title: "Error",
      page_type: "show",
      base: "/users/profile",
      base_page: "Profile"
    });
  else res.render("new", { edited: "clinics" });
};
const getHome = (_req, res) => {
  clinic.find({ status: "active" }, (err, clinicList) => {
    if (err) res.json({});
    else res.json(clinicList);
  });
};
const getNewManagerPage = (req, res) => {
  if (req.user.type != "admin")
    res.render("error", {
      error: "Error: You are not autherized.",
      title: "Error",
      page_type: "show",
      base: "/users/profile",
      base_page: "Profile"
    });
  else
    res.render("register", {
      e_msg: "",
      expand: false,
      route: `/clinics/${req.params.id}/manager`,
      type: "manager",
      id: req.params.id
    });
};
const getNewReceptionistPage = (req, res) => {
  if (req.user.type != "manager")
    res.render("error", {
      error: "Error: You are not autherized.",
      title: "Error",
      page_type: "show",
      base: "/users/profile",
      base_page: "Profile"
    });
  else
    res.render("register", {
      e_msg: "",
      expand: false,
      route: `/clinics/${req.params.id}/receptionist`,
      type: "receptionist",
      id: req.params.id
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
    }).save((err, _cb) => {
      if (err) console.log(err);
      else res.redirect("/clinics");
    });
};
const postManager = (req, res) => {
  if (req.user.type != "admin")
    res.render("error", {
      error: "Error: You are not autherized.",
      title: "Error",
      page_type: "show",
      base: "/users/profile",
      base_page: "Profile"
    });
  else
    require("./controllers/registeration")(
      req,
      res,
      `/clinics/${req.params.id}/manager`,
      "manager",
      req.params.id
    );
};
const postReceptionist = (req, res) => {
  if (req.user.type != "manager")
    res.render("error", {
      error: "Error: You are not autherized.",
      title: "Error",
      page_type: "show",
      base: "/users/profile",
      base_page: "Profile"
    });
  else
    require("./controllers/registeration")(
      req,
      res,
      `/clinics/${req.params.id}/receptionist`,
      "receptionist",
      req.params.id
    );
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
    clinic.findOne({ _id: req.params.id }, async (err, c) => {
      if (err) console.log(err);
      else {
        await appointment.updateOne(
          {
            clinic_id: req.params.id,
            patient_id: req.user.id,
            clinic_reviewed: false,
            status: "Done"
          },
          {
            $set: { clinic_reviewed: true }
          }
        );
        await clinic.updateOne(
          { _id: req.params.id },
          {
            $set: {
              rating: rate(c.appointments, req.body.clinic_rating, c.rating)
            },
            $push: {
              reviews: ` Reviewer: ${req.user.fname} ${req.user.lname}, Rating: ${req.body.clinic_rating}, Review: ${req.body.clinic_review}`
            },
            $inc: { appointments: 1 }
          }
        );
        res.redirect("/appointments");
      }
    });
  else
    clinic.findOne({ _id: req.params.id }, async (err, c) => {
      if (err) console.log(err);
      else if (c._id != req.user.clinic_id)
        res.render("error", {
          error: "Error: You are not autherized.",
          title: "Error",
          page_type: "show",
          base: "/users/profile",
          base_page: "Profile"
        });
      else {
        if (req.body.status == "inactive")
          await doctor.updateMany(
            { clinic_id: req.user.clinic_id },
            { $set: { status: "inactive" } }
          );
        await clinic.updateOne(
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
          }
        );
        res.redirect(`/clinics/${req.params.id}`);
      }
    });
};
const deleteClinic = async (req, res) => {
  if (req.user.type != "admin")
    res.render("error", {
      error: "Error: You are not autherized.",
      title: "Error",
      page_type: "show",
      base: "/users/profile",
      base_page: "Profile"
    });
  else {
    await clinic.deleteOne({ _id: req.params.id });
    await User.deleteMany({ clinic_id: req.params.id });
    await doctor.deleteMany({ clinic_id: req.params.id });
    await appointment.deleteMany({ clinic_id: req.params.id });
    res.redirect("/clinics");
  }
};

module.exports = {
  getClinics,
  getHome,
  getNewPage,
  getClinicById,
  getNewManagerPage,
  getNewReceptionistPage,
  postClinic,
  postManager,
  postReceptionist,
  editClinic,
  deleteClinic
};
