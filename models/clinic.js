const mongoose = require("mongoose");
const beautifyUnique = require("mongoose-beautiful-unique-validation");
const clinic = new mongoose.Schema({
  name: String,
  profile: String,
  services: String,
  numbers: [String],
  email: { type: String, unique: true, uniqueCaseInsensitive: true },
  location: { type: String, unique: true, uniqueCaseInsensitive: true },
  website: { type: String, unique: true, uniqueCaseInsensitive: true },
  rating: Number,
  appointments: Number,
  status: String
});
clinic.plugin(beautifyUnique);
module.exports = mongoose.model("clinic", clinic);
//status[active,inactive]
//Clinics are added by system admins
