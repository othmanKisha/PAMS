const appointment = require("../../models/appointment");
const clinic = require("../../models/clinic");
const doctor = require("../../models/doctor");

const getAppointments = (req, res) => {
  if (req.user.type == "patient")
    appointment.aggregate(
      [
        { $match: { patient_id: req.user._id } },
        {
          $lookup: {
            from: clinic,
            localFeild: clinic_id,
            foreignFeild: _id,
            as: appClinic
          }
        },
        {
          $lookup: {
            from: doctor,
            localFeild: doctor_id,
            foreignFeild: _id,
            as: appDoctor
          }
        }
      ],
      (err, appList) => {
        if (err) console.log(err);
        else
          res.render("/users/patient", {
            data: appList,
            active: "appointments"
          });
      }
    );
  else if (req.user.type == "receptionist")
    appointment.aggregate(
      [
        { $match: { clinic_id: req.user.clinic_id, status: "Pending" } },
        {
          $lookup: {
            from: doctor,
            localFeild: doctor_id,
            foreignFeild: _id,
            as: appDoctor
          }
        }
      ],
      (err, appList) => {
        if (err) console.log(err);
        else
          res.render("/users/receptionist", {
            data: appList,
            active: "pending"
          });
      }
    );
  else res.redirect("/");
};
const getFinishedAppointments = (req, res) => {
  if (req.user.type == "receptionist")
    appointment.aggregate(
      [
        { $match: { clinic_id: req.user.clinic_id, status: "Done" } },
        {
          $lookup: {
            from: doctor,
            localFeild: doctor_id,
            foreignFeild: _id,
            as: appDoctor
          }
        }
      ],
      (err, appList) => {
        if (err) console.log(err);
        else
          res.render("/users/receptionist", {
            data: appList,
            active: "finished"
          });
      }
    );
  else res.redirect("/");
};
const getAppointmentById = (req, res) => {
  if (req.user.type == "patient")
    appointment.aggregate(
      [
        { $match: { _id: req.params.id, patient_id: req.user._id } },
        {
          $lookup: {
            from: clinic,
            localFeild: clinic_id,
            foreignFeild: _id,
            as: appClinic
          }
        },
        {
          $lookup: {
            from: doctor,
            localFeild: doctor_id,
            foreignFeild: _id,
            as: appDoctor
          }
        }
      ],
      (err, appList) => {
        if (err) console.log(err);
        else
          res.render("show", {
            data: appList,
            active: "Appointment",
            user: "patient"
          });
      }
    );
  else res.redirect("/");
};
const deleteAppointment = (req, res) => {
  if (req.user.type == "receptionist")
    appointment.findOne(
      { _id: req.params.id, clinic_id: req.user.clinic_id },
      (err, _cb) => {
        if (err) console.log(err);
        else res.redirect("/");
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
