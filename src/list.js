"use strict";

// Dependencies
const express = require("express")

// Variables
const router = express.Router()

// Main
router.get("/ips", (req, res)=>{
    res.json(req.nir.ips)
})

module.exports = router