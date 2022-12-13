const express = require("express");
const router = express.Router();

// router.get("/", (req, res) => {
//   res.send("tools is nothing");
// });

// router.delete("/:id", (req, res) => {
//   res.send("nothing sending");
// });

router
  .route("/")
  .get((req, res) => {
    res.send("nothing should bed added (new addition)");
  })
  .post((req, res) => {
    res.send("this is nothing new addition");
  });

module.exports = router;
