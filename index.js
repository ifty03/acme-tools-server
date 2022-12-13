const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(process.env.PAYMENT_SECRET);
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const dbConnect = require("./utilits/dbConnect");
const toolsRoutes = require("./route/tools.route");
const port = process.env.PORT || 5000;

/* middleware */
app.use(cors());
app.use(express.json());

// database connector

dbConnect();

app.use("/tool", toolsRoutes);

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
    // await client.connect();
    // const userCollection = client.db("tools_Db").collection("users");
    // const reviewCollection = client.db("tools_Db").collection("reviews");
    // const toolsCollection = client.db("tools_Db").collection("tools");
    // const ordersCollection = client.db("tools_Db").collection("orders");
    // const verifyAdmin = async (req, res, next) => {
    //   const requester = req.decoded;
    //   const requesterAccount = await userCollection.findOne({
    //     email: requester,
    //   });
    //   if (requesterAccount.role === "admin") {
    //     next();
    //   } else {
    //     res.status(403).send({ message: "forbidden" });
    //   }
    // };
    // /* for payment intent */
    // app.post("/create-payment-intent", verifyJwt, async (req, res) => {
    //   const { totalPrice } = req.body;
    //   const amount = totalPrice * 100;
    //   const paymentIntent = await stripe.paymentIntents.create({
    //     amount: amount,
    //     currency: "usd",
    //     payment_method_types: ["card"],
    //   });
    //   res.send({
    //     clientSecret: paymentIntent.client_secret,
    //   });
    // });
    // /* get a user */
    // app.post("/user/:id", async (req, res) => {
    //   const email = req.params.id;
    //   const user = req.body;
    //   var token = jwt.sign(email, process.env.SECRET_TOKEN);
    //   const exist = await userCollection.findOne({ email: email });
    //   if (!exist) {
    //     const result = await userCollection.insertOne(user);
    //   }
    //   res.send({ token: token });
    // });
    // /* update user profile */
    // app.put("/user/:id", async (req, res) => {
    //   const email = req.params.id;
    //   const user = req.body;
    //   const filter = { email: email };
    //   const options = { upsert: true };
    //   const updateDoc = {
    //     $set: user,
    //   };
    //   const result = await userCollection.updateOne(filter, updateDoc, options);
    //   res.send(result);
    // });
    // /* post user review  */
    // app.post("/reviews", async (req, res) => {
    //   const review = req.body;
    //   const result = await reviewCollection.insertOne(review);
    //   res.send(result);
    // });
    // /* get letest 4 reviews */
    // app.get("/reviews", async (req, res) => {
    //   const cursor = reviewCollection.find({}).sort({ $natural: -1 }).limit(6);
    //   const reviews = await cursor.toArray();
    //   res.send(reviews);
    // });
    // /* get user profile information */
    // app.get("/user", verifyJwt, async (req, res) => {
    //   const email = req.query.email;
    //   const user = await userCollection.findOne({ email: email });
    //   res.send(user);
    // });
    // /* get all users */
    // app.get("/users", verifyJwt, verifyAdmin, async (req, res) => {
    //   const email = req.query.email;
    //   const users = await userCollection.find().toArray();
    //   res.send(users);
    // });
    // /* make an admin */
    // app.put("/makeAdmin/:id", verifyJwt, verifyAdmin, async (req, res) => {
    //   const email = req.params.id;
    //   const user = req.body;
    //   const filter = user;
    //   const updateDoc = {
    //     $set: { role: "admin" },
    //   };
    //   const result = await userCollection.updateOne(filter, updateDoc);
    //   res.send(result);
    // });
    // /* cancel an admin */
    // app.put("/cancelAdmin/:id", verifyJwt, async (req, res) => {
    //   const email = req.params.id;
    //   const user = req.body;
    //   const filter = user;
    //   const options = { upsert: true };
    //   const updateDoc = {
    //     $set: { role: "user" },
    //   };
    //   const result = await userCollection.updateOne(filter, updateDoc, options);
    //   res.send(result);
    // });
    // /* add a product */
    // app.post("/product", verifyJwt, verifyAdmin, async (req, res) => {
    //   const tool = req.body;
    //   const result = await toolsCollection.insertOne(tool);
    //   res.send(result);
    // });
    // /* load a product for order */
    // app.get("/tool/:id", verifyJwt, async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const tool = await toolsCollection.findOne(query);
    //   res.send(tool);
    // });
    // /* delete one tool item */
    // app.delete("/tool/:id", verifyJwt, verifyAdmin, async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await toolsCollection.deleteOne(query);
    //   res.send(result);
    // });
    // /* load all tools data */
    // app.get("/tools", async (req, res) => {
    //   const cursor = toolsCollection.find().sort({ $natural: -1 }).limit(6);
    //   const tools = await cursor.toArray();
    //   res.send(tools);
    // });
    // /* get all tools  */
    // app.get("/allTools", verifyJwt, verifyAdmin, async (req, res) => {
    //   const tools = toolsCollection.find({});
    //   const cursor = await tools.toArray();
    //   res.send(cursor);
    // });
    // /* post order in database */
    // app.post("/order", verifyJwt, async (req, res) => {
    //   const order = req.body;
    //   const result = await ordersCollection.insertOne(order);
    //   res.send(result);
    // });
    // /* get order data for spasific user */
    // app.get("/orders", verifyJwt, async (req, res) => {
    //   const email = req.query.email;
    //   const decodedEmail = req.decoded;
    //   const query = { email: email };
    //   if (email !== decodedEmail) {
    //     return res.status(403).send({ message: "access forbidden" });
    //   }
    //   const orders = await ordersCollection.find(query).toArray();
    //   res.send(orders);
    // });
    // /* single order load for payment */
    // app.get("/order/:id", verifyJwt, async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const order = await ordersCollection.findOne(query);
    //   res.send(order);
    // });
    // /* payment complete data update */
    // app.put("/payment/:id", verifyJwt, async (req, res) => {
    //   const id = req.params.id;
    //   const order = req.body;
    //   const filter = { _id: ObjectId(id) };
    //   const options = { upsert: true };
    //   const updateDoc = {
    //     $set: order,
    //   };
    //   const result = await ordersCollection.updateOne(
    //     filter,
    //     updateDoc,
    //     options
    //   );
    //   res.send(result);
    // });
    // /* cancel user order */
    // app.delete("/order/:id", verifyJwt, async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await ordersCollection.deleteOne(query);
    //   res.send(result);
    // });
    // /* get add orders for admin */
    // app.get("/allOrders", verifyJwt, verifyAdmin, async (req, res) => {
    //   const orders = await ordersCollection.find().toArray();
    //   res.send(orders);
    // });
    // /* check and verify admin */
    // app.get("/admin/:id", verifyJwt, async (req, res) => {
    //   const email = req.params.id;
    //   const user = await userCollection.findOne({ email: email });
    //   const isAdmin = user?.role === "admin";
    //   res.send({ admin: isAdmin });
    // });
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
