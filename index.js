const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
  if (!authHeader) {
    return res.status(401).send({ message: "unAuthorize access" });
  }
  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.SECRET_TOKEN, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: "forbidden access" });
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
    const toolsCollection = client.db("tools_Db").collection("tools");

    const verifyAdmin = async (req, res, next) => {
      const requester = req.decoded;
      const requesterAccount = await userCollection.findOne({
        email: requester,
      });
      if (requesterAccount.role === "admin") {
        next();
      } else {
        res.status(403).send({ message: "forbidden" });
      }
    };

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

    /* update user profile */
    app.put("/user/:id", async (req, res) => {
      const email = req.params.id;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    /* post user review  */
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });

    /* get letest 4 reviews */
    app.get("/reviews", async (req, res) => {
      const cursor = reviewCollection.find({}).sort({ $natural: -1 }).limit(4);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    /* get user profile information */
    app.get("/user", verifyJwt, async (req, res) => {
      const email = req.query.email;
      const user = await userCollection.findOne({ email: email });
      res.send(user);
    });

    /* get all users */
    app.get("/users", verifyJwt, verifyAdmin, async (req, res) => {
      const email = req.query.email;
      const users = await userCollection.find().toArray();
      res.send(users);
    });

    /* make an admin */
    app.put("/makeAdmin/:id", verifyJwt, verifyAdmin, async (req, res) => {
      const email = req.params.id;
      const user = req.body;
      const filter = user;
      const updateDoc = {
        $set: { role: "admin" },
      };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    });
    /* cancel an admin */
    app.put("/cancelAdmin/:id", verifyJwt, async (req, res) => {
      const email = req.params.id;
      const user = req.body;
      const filter = user;
      const options = { upsert: true };
      const updateDoc = {
        $set: { role: "user" },
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    /* add a product */
    app.post("/product", verifyJwt, verifyAdmin, async (req, res) => {
      const tool = req.body;
      const result = await toolsCollection.insertOne(tool);
      res.send(result);
    });

    /* load a product for order */
    app.get("/tool/:id", verifyJwt, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const tool = await toolsCollection.findOne(query);
      res.send(tool);
    });

    /* load all tools data */
    app.get("/tools", async (req, res) => {
      const cursor = toolsCollection.find().sort({ $natural: -1 }).limit(6);
      const tools = await cursor.toArray();
      res.send(tools);
    });
    app.get("/allTools", async (req, res) => {
      const tools = await toolsCollection.find().toArray();
      res.send(tools);
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
