const mail = require("../../config/nodemailer");
const appointment = require("../../models/appointment");
const User = require("../../models/user");
const doctor = require("../../models/doctor");
const serviceMail = require("../../config/keys").EMAIL;

const sendPendingMail = (req, res) => {
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
                  if (u.type == "patient")
                    mail.sendMail({
                      from: serviceMail.email,
                      to: u.email,
                      subject: `A New Appointment Pending`,
                      text: `Dear Mr. ${u.name},\n
                      Your appointment request for Dr.${doc.lname} 
                      at ${app.date} ${app.time} has been sent successfully.\n
                      regards,\n
                      PAMS Team`
                    });
                  else
                    mail.sendMail({
                      from: serviceMail.email,
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
        }
      );
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
                    from: serviceMail.email,
                    to: u.email,
                    subject: `Appointment Confirmed`,
                    text: `Dear Mr. ${u.name},\n
                    Appointment with Dr.${doc.lname} at 
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
const sendDoneMail = (req, res) => {
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
                    from: serviceMail.email,
                    to: u.email,
                    subject: `Appointment Finished`,
                    text: `Dear Mr. ${u.name},\n
                    Appointment with Dr.${doc.lname} at 
                    ${app.date} ${app.time} has just finished.\n
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

module.exports = { sendPendingMail, sendConfirmationMail, sendDoneMail };
