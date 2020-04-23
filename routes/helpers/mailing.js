const mail = require("../../config/nodemailer");
const appointment = require("../../models/appointment");
const User = require("../../models/user");
const doctor = require("../../models/doctor");

const sendPendingMail = (req, res) => {
  appointment.findOne({ _id: req.params.id }, (err, app) => {
    if (err) console.log(err);
    else
      User.find({ clinic_id: app.clinic_id }, (err, users) => {
        if (err) console.log(err);
        else
          doctor.findOne({ _id: app.doctor_id }, (err, doc) => {
            if (err) console.log(err);
            else {
              users.forEach(u => {
                mail.sendMail({
                  from: "pams.Habboush.Kisha@gmail.com",
                  to: u.email,
                  subject: `A New Appointment Pending`,
                  text: `Dear Mr. ${u.name},\n
                  A new appointment is pending for Dr.${doc.lname} 
                  at ${app.date} ${app.time}.\n
                  regards,\n
                  PAMS Team`
                });
              });
              res.redirect("/");
            }
          });
      });
  });
};
const sendConfirmationMail = (req, res) => {
  appointment.findOne({ _id: req.params.id }, (err, app) => {
    if (err) console.log(err);
    else
      User.find(
        { $or: [{ _id: app.patient_id }, { clinic_id: app.clinic_id }] },
        (err, users) => {
          if (err) console.log(err);
          else
            doctor.findOne({ _id: app.doctor_id }, (err, doc) => {
              if (err) console.log(err);
              else {
                users.forEach(u => {
                  mail.sendMail({
                    from: "pams.Habboush.Kisha@gmail.com",
                    to: u.email,
                    subject: `Appointment Confirmed`,
                    text: `Dear Mr. ${u.name},\n
                    Your appointment with Dr.${doc.lname} at 
                    ${app.date} ${app.time} has been confirmed.\n
                    regards,\n
                    PAMS Team`
                  });
                });
                res.redirect("/");
              }
            });
        }
      );
  });
};

module.exports = { sendPendingMail, sendConfirmationMail };
