function dbConnect() {
  //     const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3zjl8.mongodb.net/?retryWrites=true&w=majority`;
  // const client = new MongoClient(uri, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  //   serverApi: ServerApiVersion.v1,
  // });
  console.log("database connected");
}
module.exports = dbConnect;
