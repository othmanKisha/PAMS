const DATABASE_URL =
  "mongodb://pams:LGUUx9YVKvUNh9Z8gBVM3GsRLnUDQboKvMRVYhNz8njVjnaiizS3npjAstfJcpPsCOjAdHADvGk5W5DabDV6qg%3D%3D@pams.mongo.cosmos.azure.com:10255/?ssl=true&appName=@pams@";

module.exports = mongoose => {
  mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  });
};
