const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');


const authRouter = express.Router();   

authRouter.post("/signup", async(req,res)=>{
    //Validation of Data

    //Encrypt the password

    //Store data in the database
    try{
        // validateSignUpData(req.body);
        const {firstName, lastName, emailId, password} = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({firstName, lastName, emailId, password: passwordHash});// creating a new instance of the User Model
        const savedUser = await user.save();
        const token = await jwt.sign({ _id: savedUser._id }, 'abcdefghijklmnopqrstuvwxyz',{expiresIn: "1d"});//secret data, private key
        res.cookie("token",token, {expires: new Date(Date.now() + 8 * 3600000)});
        res.json({message: "User Added successfully!!", data : savedUser});
    }catch(err){
              res.status(500).send("Error: " + err.message);
    }

});

authRouter.post("/login",async(req,res)=>{
    try{
        const {emailId, password} = req.body;
        const user = await User.findOne({ emailId: emailId}).select("firstName lastName age gender password photoUrl about skills");;
        if(!user){
            throw new Error("User not found");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);//plain password and passwordHash
        if(isPasswordValid){
            const token = await jwt.sign({ _id: user._id }, 'abcdefghijklmnopqrstuvwxyz',{expiresIn: "1d"});//secret data, private key
            res.cookie("token",token);
            res.json({message: "Authentication Success", data: user});
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