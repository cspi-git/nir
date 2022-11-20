"use strict";

// Dependencies
const request = require("request-async")
const express = require("express")
const helmet = require("helmet")
const path = require("path")

// Variables
var nir = {
    ips: [],
    antiExhaust: 0
}

const web = express()
const port = process.env.PORT || 8080

// Functions
function publicFiles(file){
    return path.join(__dirname, "public", file)
}

async function ipsGrabber(){
    const response = await request("https://api.ipify.org", {
        proxy: "http://gateway.negy.io:1080/"
    })

    if(nir.antiExhaust === 10){
        nir.antiExhaust = 0
        return setTimeout(ipsGrabber, 1000 * 60 * 60 * 1)
    }

    if(!nir.ips.includes(response.body)){
        nir.antiExhaust = 0
        nir.ips.push(response.body)
    }else{
        nir.antiExhaust++
    }

    setTimeout(ipsGrabber, 1000 * 5)
}

/// Configurations
// Express
web.use(helmet())

// Main
web.use("", function(req, res, next){
    if(req.path.indexOf(".html") !== -1) return res.redirect("/404")

    const external = {
        nir: nir
    }

    req = Object.assign(req, external) // deepscan-disable-line

    next()
})

web.use(express.static(path.join(__dirname, "public")))
web.use("/api", require("./src/index"))

web.get("/404", (req, res)=>res.sendFile(publicFiles("404.html")))

web.use("*", (req, res)=>res.redirect("/404"))
web.listen(port, ()=>console.log(`Server is running. Port: ${port}`))

ipsGrabber()