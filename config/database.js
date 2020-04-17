const DATABASE_URL = "mongodb://localhost:27017/PAMS";

module.exports = mongoose => {
  mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  });
};
