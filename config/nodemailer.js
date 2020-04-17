const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "pams.Habboush.Kisha@gmail.com",
    pass: "Pams1Pams2Pams3"
  }
});

module.exports = transporter;
