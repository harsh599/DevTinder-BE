const express = require('express');
const userRouter = express.Router(); 
const User = require("../models/user");
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require('../models/connectionRequest');
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";
const mongoose = require("mongoose");

userRouter.get("/requests/received",userAuth, async(req,res) => {
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: new mongoose.Types.ObjectId(loggedInUser._id),
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA);
        res.json({message: "Records fetched successfully!!" , data: connectionRequests});
    }catch(err){
        res.status(404).send("Error: "  + err.message);
    }
});

userRouter.get("/connections", userAuth, async(req,res) => {

    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id, status: "accepted"},
                {fromUserId: loggedInUser._id, status: "accepted"},
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);
        const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){return row.toUserId;}
            return row.fromUserId;
        });
        res.status(200).json({message:"Connections Sent Successfully" , data});

    }catch(err){
        res.status(404).send("Error: "  + err.message);
    }
});

userRouter.get("/feed",userAuth, async (req, res) => {
    //expect route to be /feed?page=1&limit= 10
    try{
        /*
            User should see all the card of different user except
            1) His own card
            2) His Connections 
            3) Ignored People
            4) Already Sent the connection request

        */
            const loggedInUser = req.user;

            const page = parseInt(req.query.page) || 1;
            let limit = parseInt(req.query.limit) || 10;
            limit = (limit > 50) ? 50 : limit; 
            const skip = (page - 1)*limit;
            const connectionRequest = await ConnectionRequest.find({
                $or:[
                    {fromUserId:loggedInUser._id} , {toUserId: loggedInUser._id}]
           }) // this will contain records where either the
            //  logged in user has sent a connection request or some other user has sent the request to logged in user

            const hideUsersFromFeed = new Set();
          if (connectionRequest.length > 0) {
            connectionRequest.forEach(req => {
                hideUsersFromFeed.add(req.fromUserId.toString());
                hideUsersFromFeed.add(req.toUserId.toString());
            });
            } else {
             hideUsersFromFeed.add(req.user._id);
            }
            const users = await User.find({ // findAll the user who are not present in the hideUsersFrom Feed and not the user himself
                $and:[
                    {_id: {$nin: Array.from(hideUsersFromFeed)}}, 
                    {_id: {$ne : loggedInUser._id}}
                ]
            }).skip(skip).limit(limit);

            res.status(200).send(users);



    }catch(err){
        res.status(404).send("Error: "  + err.message);
    }
});


module.exports = userRouter;