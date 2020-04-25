const nodemailer = require("nodemailer");
const emailer = require("./keys").EMAIL;
const transporter = nodemailer.createTransport({
  service: emailer.service,
  auth: {
    user: emailer.email,
    pass: emailer.password
  }
});

module.exports = transporter;
