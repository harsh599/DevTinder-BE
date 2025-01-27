const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const User = require('../models/user');

const requestRouter = express.Router(); 

requestRouter.post("/send/:status/:toUserId", userAuth, async(req, res) => {

    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["interested", "ignored"];

        if(!allowedStatus.includes(status)){
            return res.send(400).json({"message": "Invalid status type"});
        }

        const toUser = User.findById(toUserId);
        if(!toUser){
            return res.send(404).json({"message": "User Not Found"});
        }

        const existingConnectionRequest = await ConnectionRequestModel.findOne({
           $or: [ // a way to write or condition in mongo db
            { fromUserId: toUserId },
            { fromUserId: toUserId, toUserId: fromUserId}]
        });

        if(existingConnectionRequest){
            res.status(400).json({"message": "Connection Request Already Exists"});
        }

        // console.log("Inside reqest route", status, fromUserId, toUserId);
        const connectionRequest = new ConnectionRequestModel({
            fromUserId: fromUserId,
            toUserId: toUserId,
            status: status
        });
        // console.log("COnenction save"+ connectionRequest);
        const data = await connectionRequest.save();

        res.json({
            message:"Connection request sent successfully!!", status: 200, data
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

        const connectionRequest = await ConnectionRequestModel.findOne({
            fromUserId: requestId,
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId",["firstName","lastName"]);//since fromUserId is referenced to User schema, and we want only the firstName and lastName fields

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