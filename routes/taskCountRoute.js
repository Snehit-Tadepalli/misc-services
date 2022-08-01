const express = require("express");
const router = express.Router();

const { taskCount } = require("../controllers/taskCountController");

router.get("/", taskCount);

module.exports = router;
