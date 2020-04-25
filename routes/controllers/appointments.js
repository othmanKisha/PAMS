const appointment = require("../../models/appointment");
const clinic = require("../../models/clinic");
const doctor = require("../../models/doctor");
const { sendDoneMail, sendConfirmationMail } = require("../helpers/mailing");

const getAppointments = (req, res) => {
  if (req.user.type == "patient")
    appointment.find({ patient_id: req.user._id }, (err, appList) => {
      if (err) console.log(err);
      else
        res.render("patient", {
          data: appList,
          active: "appointments",
          title: "Appointments Page",
          page_type: "home",
          base: "/users/profile",
          base_page: "Profile"
        });
    });
  else if (req.user.type == "receptionist")
    appointment.find(
      { clinic_id: req.user.clinic_id, status: "Pending" },
      (err, appList) => {
        if (err) console.log(err);
        else
          res.render("receptionist", {
            data: appList,
            active: "pending",
            title: "Pending Appointments",
            page_type: "home",
            base: "/users/profile",
            base_page: "Profile"
          });
      }
    );
  else
    res.render("error", {
      error: "Error: You are not autherized.",
      title: "Error",
      page_type: "show",
      base: "/users/profile",
      base_page: "Profile"
    });
};
const getFinishedAppointments = (req, res) => {
  if (req.user.type == "receptionist")
    appointment.find(
      { clinic_id: req.user.clinic_id, status: "Done" },
      (err, appList) => {
        if (err) console.log(err);
        else
          res.render("receptionist", {
            data: appList,
            active: "finished",
            title: "Finished Appointments",
            page_type: "home",
            base: "/users/profile",
            base_page: "Profile"
          });
      }
    );
  else
    res.render("error", {
      error: "Error: You are not autherized.",
      title: "Error",
      page_type: "show",
      base: "/users/profile",
      base_page: "Profile"
    });
};
const getAppointmentById = (req, res) => {
  if (req.user.type == "patient")
    appointment.findOne({ _id: req.params.id }, (err, appList) => {
      if (err) console.log(err);
      else
        clinic.findOne({ _id: appList.clinic_id }, (err, c) => {
          if (err) console.log(err);
          else
            doctor.findOne({ _id: appList.doctor_id }, (err, d) => {
              if (err) console.log(err);
              else
                res.render("show", {
                  data: appList,
                  addData: {
                    c_name: c.name,
                    d_fname: d.fname,
                    d_lname: d.lname
                  },
                  active: "Appointment",
                  user: "patient",
                  doctors: "",
                  title: "Appointment Info",
                  page_type: "show",
                  base: "/users/profile",
                  base_page: "Profile"
                });
            });
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
const editAppointment = (req, res) => {
  if (req.user.type == "patient")
    appointment.findOne(
      { _id: req.params.id, patient_id: req.user._id, status: "Confirmed" },
      async (err, app) => {
        if (err) console.log(err);
        else if (!app)
          res.render("error", {
            error: "Error: There is no appointment with this id.",
            title: "Error",
            page_type: "show",
            base: "/users/profile",
            base_page: "Profile"
          });
        else {
          await doctor.updateOne(
            { _id: app.doctor_id },
            { $set: { status: "active" } }
          );
          await appointment.updateOne(
            { _id: req.params.id },
            { $set: { status: "Done" } }
          );
          sendDoneMail(req, res);
        }
      }
    );
  else if (req.user.type == "receptionist")
    appointment.findOne(
      { _id: req.params.id, clinic_id: req.user.clinic_id, status: "Pending" },
      async (err, app) => {
        if (err) console.log(err);
        else if (!app)
          res.render("error", {
            error: "Error: There is no appointment with this id.",
            title: "Error",
            page_type: "show",
            base: "/users/profile",
            base_page: "Profile"
          });
        else {
          await doctor.updateOne(
            { _id: app.doctor_id },
            { $set: { status: "busy" } }
          );
          await appointment.updateOne(
            { _id: req.params.id },
            { $set: { status: "Confirmed" } }
          );
          sendConfirmationMail(req, res);
        }
      }
    );
  else
    res.render("error", {
      error: "Error: There is no appointment with this id.",
      title: "Error",
      page_type: "show",
      base: "/users/profile",
      base_page: "Profile"
    });
};
const deleteAppointment = (req, res) => {
  if (req.user.type == "receptionist")
    appointment.findOne(
      { _id: req.params.id, clinic_id: req.user.clinic_id },
      async (err, app) => {
        if (err) console.log(err);
        else if (!app)
          res.render("error", {
            error: "Error: There is no appointment with this id.",
            title: "Error",
            page_type: "show",
            base: "/users/profile",
            base_page: "Profile"
          });
        else {
          await appointment.deleteOne({ _id: req.params.id });
          res.redirect("/");
        }
      }
    );
  else
    res.render("error", {
      error: "Error: You are not autherized.",
      title: "Error",
      page_type: "show",
      base: "/users/profile",
      base_page: "Profile"
    });
};

module.exports = {
  getAppointments,
  getFinishedAppointments,
  getAppointmentById,
  editAppointment,
  deleteAppointment
};
