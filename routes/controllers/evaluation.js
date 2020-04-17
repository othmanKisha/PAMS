const appointment = require("../../models/appointment");
const clinic = require("../../models/clinic");
const doctor = require("../../models/doctor");
const { sendPendingMail, sendConfirmationMail } = require("../helpers/mailing");
const { rateClinicAndDoctor } = require("../helpers/rate");

module.exports = (req, res) => {
  if (req.user.type == "receptionist")
    appointment.updateOne(
      { _id: req.params.id, clinic_id: req.user.clinic_id, status: "Pending" },
      { $set: { status: "Confirmed" } },
      (err, app) => {
        if (err) console.log(err);
        else
          doctor.updateOne(
            { _id: app.doctor_id },
            { $set: { status: "busy" } },
            (err, _cb) => {
              if (err) console.log(err);
              else sendPendingMail(req, res);
            }
          );
      }
    );
  else if (req.user.type == "patient")
    appointment.updateOne(
      { _id: req.params.id, patient_id: req.user._id, status: "Confirmed" },
      {
        $set: {
          reviewed: true,
          review: req.body.review,
          doctor_rating: Number(req.body.doctor_rating),
          clinic_rating: Number(req.body.clinic_rating),
          status: "Done"
        }
      },
      (err, app) => {
        if (err) console.log(err);
        else
          appointment.find(
            { doctor_id: app.doctor_id, status: { $ne: "Done" } },
            (err, a) => {
              if (err) console.log(err);
              else if (!a)
                doctor.updateOne(
                  { _id: app.doctor_id },
                  { $set: { status: "active" } },
                  (err, _cb) => {
                    if (err) console.log(err);
                    else
                      rateClinicAndDoctor(
                        clinic,
                        app.clinic_id,
                        Number(req.body.clinic_rating),
                        rateClinicAndDoctor(
                          doctor,
                          app.doctor_id,
                          Number(req.body.doctor_rating),
                          sendConfirmationMail(req, res)
                        )
                      );
                  }
                );
              else
                rateClinicAndDoctor(
                  clinic,
                  app.clinic_id,
                  Number(req.body.clinic_rating),
                  rateClinicAndDoctor(
                    doctor,
                    app.doctor_id,
                    Number(req.body.doctor_rating),
                    sendConfirmationMail(req, res)
                  )
                );
            }
          );
      }
    );
  else res.redirect("/");
};
