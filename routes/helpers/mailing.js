const mail = require("../../config/nodemailer");
const appointment = require("../../models/appointment");
const User = require("../../models/user");
const doctor = require("../../models/doctor");

export const sendPendingMail = (req, res) => {
  appointment.aggregate(
    [
      { $match: { _id: req.params.id } },
      {
        $lookup: {
          from: User,
          localFeild: clinic_id,
          foreignFeild: clinic_id,
          as: users
        }
      },
      {
        $lookup: {
          from: doctor,
          localFeild: doctor_id,
          foreignFeild: _id,
          as: doctors
        }
      }
    ],
    (err, appUsers) => {
      if (err) console.log(err);
      else {
        appUsers.users.forEach(u => {
          mail.sendMail({
            from: "pams.Habboush.Kisha@gmail.com",
            to: u.email,
            subject: `A New Appointment Pending`,
            text: `Dear Mr. ${u.name},\n
                A new appointment is pending for Dr.${appUsers.doctors[0].lname} 
                at ${appUsers.date} ${appUsers.time}.\n
                regards,\n
                PAMS Team`
          });
        });
        res.redirect("/");
      }
    }
  );
};
export const sendConfirmationMail = (req, res) => {
  appointment.aggregate(
    [
      { $match: { _id: req.params.id } },
      {
        $lookup: {
          from: User,
          localFeild: patient_id,
          foreignFeild: _id,
          as: users
        }
      },
      {
        $lookup: {
          from: doctor,
          localFeild: doctor_id,
          foreignFeild: _id,
          as: doctors
        }
      }
    ],
    (err, appUsers) => {
      if (err) console.log(err);
      else {
        appUsers.users.forEach(u => {
          mail.sendMail({
            from: "pams.Habboush.Kisha@gmail.com",
            to: u.email,
            subject: `Appointment Confirmed`,
            text: `Dear Mr. ${u.name},\n
                    Your appointment with Dr.${appUsers.doctors[0].lname} at 
                    ${appUsers.date} ${appUsers.time} has been confirmed.\n
                    regards,\n
                    PAMS Team`
          });
        });
        res.redirect("/");
      }
    }
  );
};
