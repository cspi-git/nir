"use strict";

// Dependencies
const express = require("express")

// Variables
const router = express.Router()

// Main
router.use("/list", require("./list"))

module.exports = router