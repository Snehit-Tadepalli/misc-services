const express = require("express");
const router = express.Router();

const { test } = require("../controllers/testController");

router.get("/", test);

module.exports = router;
