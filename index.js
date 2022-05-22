const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;

/* middleware */
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3zjl8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const verifyJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split[1];
  if (!authHeader) {
    return res.send({ status: 401, message: "unAuthorize access" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
    if (err) {
      return res.send({ status: 403, message: "forbidden access" });
    }
    if (decoded) {
      req.decoded = decoded;
      next();
    }
  });
};

const run = async () => {
  try {
    await client.connect();
    const userCollection = client.db("tools_Db").collection("users");
    const reviewCollection = client.db("tools_Db").collection("reviews");

    app.post("/user/:id", async (req, res) => {
      const email = req.params.id;
      const user = req.body;
      var token = jwt.sign(email, process.env.SECRET_TOKEN);
      const exist = await userCollection.findOne({ email: email });
      if (!exist) {
        const result = await userCollection.insertOne(user);
      }
      res.send({ token: token });
    });

    /* post user review  */
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });
  } finally {
    // await client.close()
  }
};
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
