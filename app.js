require("dotenv").config();


const express = require("express");


const mongoose = require("mongoose");

const app = express()

app.use(express.json())

async function DBconnection(){
    try{
        mongoose.connect(process.env.DB_URL);
        console.log("db connected")
    }catch(error){
        console.log("db disconnected")
    }
}


const port = process.env.PORT || 3000;

DBconnection()

app.get("/",(req, res)=>{
    res.send("welcome to root")
})

