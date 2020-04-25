const database = require("./keys").DATABASE;
const DATABASE_URL = database.url;
module.exports = mongoose => {
  mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  });
};
