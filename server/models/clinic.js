const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const clinic = new mongoose.Schema({
    name: String,
    profile: String,
    services: String,
    numbers: [String],
    email: { type: String, unique: true, uniqueCaseInsensitive: true },
    location: { type: String, unique: true, uniqueCaseInsensitive: true },
    website: { type: String, unique: true, uniqueCaseInsensitive: true },
    rating: Number,
    status: String
});
clinic.plugin(beautifyUnique);
module.exports = mongoose.model('clinic', clinic);
//status[Available,Temporarily unavailable, Hidden]
//Clinics are added by system admins
//news are added by clinic managers