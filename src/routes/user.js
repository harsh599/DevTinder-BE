const express = require('express');
const userRouter = express.Router(); 
const User = require("../models/user");
const {userAuth} = require("../middlewares/auth");
const ConnectionRequestModel = require('../models/connectionRequest');


userRouter.patch("/", userAuth,async(req, res) => {
    const userId = req.body.userId;
    const data = req.body;
    try{
        const user = await User.findByIdAndUpdate(userId,data);
        res.send("User Updated successfully!!");
    }catch(e){
        res.status(404).send("Error: "  + err.message);

    }
});

//Get user by email
userRouter.get("/",userAuth, async(req, res)=>{
    const userEmail = req.body.email;
    try{
       const user = await User.find({email: userEmail});
       res.send(user);
    }catch(err){
        res.status(404).send("Error: "  + err.message);

    }

});


userRouter.delete("/",userAuth, async(req, res) => {
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully!!");
    }catch(e){
        res.status(404).send("Error: "  + err.message);

    }
});


userRouter.get("/feed",userAuth, async(req, res) => {
   const userEmail = req.body.email;
    try{
       const user = await User.find();
       res.send(user);
    }catch(err){
        res.status(404).send("Error: "  + err.message);

    }
});

userRouter.get("/requests/received",userAuth, async(req,res) => {
    try{
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "interested"
        });
        res.json({message: "Records fetched successfully!!" , data: connectionRequest});
    }catch(err){
        res.status(404).send("Error: "  + err.message);
    }
});

userRouter.get("/connections", userAuth, async(req,res) => {

    try{
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequestModel.find({
            $or: [
                {toUserId: loggedInUser._id, status: "accepted"},
                {fromUserId: loggedInUser._id, status: "accepted"},
            ]
        }).populate("fromUserId",["firstName","lastName"]);
        const data = connectionRequest.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){return row.toUserId;}
            return row.fromUserId;
        });
        res.status(200).json({message:"Connections Sent Successfully" , data});

    }catch(err){
        res.status(404).send("Error: "  + err.message);
    }
});


module.exports = userRouter;