const jwt = require("jsonwebtoken");
const User = require("../models/user");


const userAuth = async(req, res, next) => {
    try{
    //Read the token
    const {token} = req.cookies;
     if(!token){
        throw new Error("Invalid Token!!");
    }
    // decode the token
    const decodedObj = await jwt.verify(token, "abcdefghijklmnopqrstuvwxyz");

    const {_id} = decodedObj;
    const user = await User.findById(_id);
    if(!user){
        throw new Error("User Not Found!!");
    }
    req.user = user;
    console.log("Token Verified!!");
    next();
    }
    catch(err){
        res.status(400).send("ERROR:"+ err.message);
    }
  

}

module.exports ={
    userAuth
};