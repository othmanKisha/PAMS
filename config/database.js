const DATABASE_URL = require("./keys").DATABASE.url;

module.exports = mongoose => {
  mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  });
};
