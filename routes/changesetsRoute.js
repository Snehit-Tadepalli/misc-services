const express = require("express");
const router = express.Router();

const { changesets } = require("../controllers/changesetsController");

router.get("/", changesets);

module.exports = router;
