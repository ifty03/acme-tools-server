const express = require("express");
const router = express.Router();
const toolControler = require("../controlers/tool.controler");

// router.get("/", (req, res) => {
//   res.send("tools is nothing");
// });

// router.delete("/:id", (req, res) => {
//   res.send("nothing sending");
// });

router
  .route("/")
  .get(toolControler.getAllTool)
  .post((req, res) => {
    res.send("this is nothing new addition");
  });

module.exports = router;
