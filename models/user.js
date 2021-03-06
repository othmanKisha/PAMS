const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const User = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  type: String,
  fname: String,
  lname: String,
  regDate: String,
  numbers: String,
  status: String,
  //if type is receptionist or manager
  clinic_id: String
  //System admin needs to additional types
});

User.plugin(passportLocalMongoose, { usernameField: "email" });
module.exports = mongoose.model("User", User);
//status[Verified, Inactive, Unverified]
//type[patient,manager,receptionist,admin]
//Clinic managers accounts are created by system admins
//Receptionists accounts are created by clinic managers
