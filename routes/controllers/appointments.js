const appointment = require("../../models/appointment");
const clinic = require("../../models/clinic");
const doctor = require("../../models/doctor");

const getAppointments = (req, res) => {
  if (req.user.type == "patient")
    appointment.find({ patient_id: req.user._id }, (err, appList) => {
      if (err) console.log(err);
      else
        res.render("patient", {
          data: appList,
          active: "appointments",
          title: "Appointments",
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
            title: "Appointments",
            page_type: "home",
            base: "/users/profile",
            base_page: "Profile"
          });
      }
    );
  else res.redirect("/");
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
            title: "Appointments",
            page_type: "home",
            base: "/users/profile",
            base_page: "Profile"
          });
      }
    );
  else res.redirect("/");
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
                  title: "Appointment",
                  page_type: "show",
                  base: "/users/profile",
                  base_page: "Profile"
                });
            });
        });
    });
  else res.redirect("/");
};
const deleteAppointment = (req, res) => {
  if (req.user.type == "receptionist")
    appointment.findOne(
      { _id: req.params.id, clinic_id: req.user.clinic_id },
      (err, app) => {
        if (err) console.log(err);
        else if (!app) console.log(app);
        else
          appointment.deleteOne(
            { _id: req.params.id, clinic_id: req.user.clinic_id },
            (err, _cb) => {
              if (err) console.log(err);
              else res.redirect("/");
            }
          );
      }
    );
  else res.redirect("/");
};

module.exports = {
  getAppointments,
  getFinishedAppointments,
  getAppointmentById,
  deleteAppointment
};
