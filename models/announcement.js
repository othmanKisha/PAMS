const mongoose = require("mongoose");
const announcement = new mongoose.Schema({
  content: String,
  date: String,
  submitter: String
});
module.exports = mongoose.model("announcement", announcement);
//announcments are created by system admins
