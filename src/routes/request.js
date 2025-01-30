const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const mongoose = require("mongoose");

const requestRouter = express.Router(); 

requestRouter.post("/send/:status/:toUserId", userAuth, async(req, res) => {

    try{
        const fromUserId = req.user._id;
        const toUserId = new mongoose.Types.ObjectId(req.params.toUserId);
        const status = req.params.status;

        const allowedStatus = ["interested", "ignored"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({"message": "Invalid status type"});
        }
        const toUser = await User.findById(toUserId);

        if(!toUser){
            return res.status(404).json({"message": "User Not Found"});
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
           $or: [ // a way to write or condition in mongo db
            { fromUserId: toUserId },
            { fromUserId: toUserId, toUserId: fromUserId}]
        });

        if(existingConnectionRequest){
            res.status(400).json({"message": "Connection Request Already Exists"});
        }
        

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });
        const data = await connectionRequest.save();

      res.json({
        message:
          req.user.firstName + " is " + status + " in " + toUser.firstName,
        data,
      });

    }catch(err){
        res.status(400).send("Error: " + err.message);
    }
});

requestRouter.post("/review/:status/:requestId", userAuth, async(req, res) => {

    try{
        const loggedInUser = req.user;
        const requestId = req.params.requestId;
        const status = req.params.status;

        const allowedStatus = ["accepted", "rejected"];

        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: "Invalid status type"});
        }

        const connectionRequest = await ConnectionRequest.findOne({
                _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested",
        });//since fromUserId is referenced to User schema, and we want only the firstName and lastName fields

        if(!connectionRequest){
            return res.status(404).json({message: "Connection request not found"});
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save();

        res.json({
            message:"Connection request "+status, status: 200, data
        });

    }catch(err){
        res.status(400).send("Error: " + err.message);
    }
});

module.exports = requestRouter;