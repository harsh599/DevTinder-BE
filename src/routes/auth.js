const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');


const authRouter = express.Router();   

authRouter.post("/signup", async(req,res)=>{

    //Validation of Data

    //Encrypt the password

    //Store data in the database
    console.log(req.body);

    try{
        // validateSignUpData(req.body);
        const {firstName, lastName, email, password} = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);
        const user = new User({firstName, lastName, email, password: passwordHash});// creating a new instance of the User Model
        await user.save();
        res.send("User Added successfully!!");
    }catch(err){
              res.status(500).send("Error: " + err.message);
    }

});

authRouter.post("/login",async(req,res)=>{
    try{
        const {email, password} = req.body;

        // if(){//validate email id first

        // }
        const user = await User.findOne({ email: email});
        if(!user){
            throw new Error("User not found");
        }
        console.log("Fetched password from db is: "+user.password);
        const isPasswordValid = await bcrypt.compare(password, user.password);//plain password and passwordHash
        if(isPasswordValid){
            // const token = await user.getJWT();
            const token = await jwt.sign({ _id: user._id }, 'abcdefghijklmnopqrstuvwxyz',{expiresIn: "1h"});//secret data, private key
            console.log(token);
            res.cookie("token",token);
            res.send("Authentication successful!!");
        }else{
            throw new Error("User Not Present");
        }
    }catch(err){
        res.status(500).send("Error: " + err.message);
    }
});


authRouter.post("/logout", async (req, res) => {
    res.cookie("token",null, {expiresIn: new Date(Date.now())});
    res.send("User Logged Out! Successfully !!");
});



module.exports = authRouter;