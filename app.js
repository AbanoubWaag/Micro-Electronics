require("dotenv").config();
const bcrypt = require("bcrypt");



const express = require("express");


const mongoose = require("mongoose");


const app = express()

app.use(express.json())


const port = process.env.PORT || 3000;

async function DBconnection(){
    try{
        await mongoose.connect(process.env.DB_URL);
        console.log("db connected")
    }catch(error){
        console.log("db disconnected")
    }
}

DBconnection()

const   User = require("./models/User")

app.post("/register", async (req, res) => {
    try {
        const {username,email,password} = req.body;    
        
        if
(!username || !email || !password){
            return res.status(400).json({message:"all fields are required"}) //missing data
        }



        const existUser = await User.findOne({ email });

         if (existUser) {
            return res.status(400).json({ message: "user already exists" });
        }

        const hashPassword =await bcrypt.hash(password, 10);

        const user = await  User.create({
            username,
            email,
            password:hashPassword,
            role
            :"user"
        })
        res.status(201).json({
            msg:"done created user",
            data:user
        });
      
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "server error" });
    }
});



app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

      if(!email || !password) {
            return res.status(400).json({ message: "all fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "invalid credentials" });  // or accocunt not found
        }
        const matchPassword = await bcrypt.compare(password, user.password);
        if(!matchPassword) {
            return res.status(400).json({ message: "invalid credentials" });
        }

        const authcode = Buffer.from(user._id.toString()).toString("base64");

        res.status(200).json({
            msg: "login success",
            data: authcode
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});


app.get("/",(req, res)=>{
    res.send("welcome to root")
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


