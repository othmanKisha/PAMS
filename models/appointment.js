const mongoose = require("mongoose");
const beautifyUnique = require("mongoose-beautiful-unique-validation");
const appointment = new mongoose.Schema({
  date: String,
  time: String,
  patient_id: String,
  doctor_id: String,
  clinic_id: String,
  doctor_reviewed: Boolean,
  clinic_reviewed: Boolean,
  status: String
});
appointment.plugin(beautifyUnique);
module.exports = mongoose.model("appointment", appointment);
//status[Pending,Confirmed,Done]
//receptioninsts can modify the status of appointments and users can delete them if they are pending only or make it done
//no two appointments of same date and time with same doctor can be created
