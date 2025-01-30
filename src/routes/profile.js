const express = require('express');
const {userAuth} = require("../middlewares/auth");
const { validateEditProfileData } = require('../utils/validation');
const profileRouter = express.Router();

profileRouter.get("/view",userAuth, async(req, res)=>{
    try{
        const user = req.user;
        res.send(user);
    }catch(e){
        res.status(400).send("Error: " + e.message);
    }
});

profileRouter.patch("/edit",userAuth, async(req, res)=>{
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit Request!!");
        }
        const loggedInUser = req.user;
        loggedInUser.firstName = req.body.firstName;// one way of updating info, simillarly other fields can be updated. 
        
        Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key]);

        await loggedInUser.save();
        
        res.json({
            message: `${loggedInUser.firstName} profile has been updated successfully!`,
            data: loggedInUser
        });
    }catch(e){
        res.status(400).send("Error: " + e.message);
    }
});



module.exports = profileRouter;