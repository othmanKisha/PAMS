const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const doctor = new mongoose.Schema({
    fname: String,
    lname: String,
    email:  {type : String , unique : true, uniqueCaseInsensitive: true},
    profile: String,
    status: String,
    numbers: String,
    speciality: String,
    experience: Number,
    rating: Number,
    office: String,
    clinic_id: String
});
doctor.plugin(beautifyUnique);
module.exports = mongoose.model('doctor', doctor);
//status[Available,On vacation, Hidden]
//Doctors are added by clinic manager