const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,// _id : "adfasf3asfaew" type
        required: true,
        ref: "User" // this tells that the fromUserId is a reference to the User collection
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    status:{
        type: String,
        enum: {
            values:["ignored", "interested", "accepted", "rejected"],
            message: "{Value} is incorrect status type"
        },
        required: true,

    }
},{
 timestamps:true,
}
);

connectionRequestSchema.pre("save", function(next){ // this is like a middleware, or a hook, that will be called every time a connectionRequest
    //will be saved
    const connectionRequest = this;
    //Check if fromUserId is same as toUserId

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot save a connection request to yourself");
    }
    next();// very imp to call next method here
});

connectionRequestSchema.index({fromUserId:1, toUserId:1});// compound index added
//Indexes are aded to make querying database faster as when the db grows, the api's will become slow.
// Here we are adding compound indexes such that whenever db is queried using both fromUserId and toUserId
//this compound index will help in querying it very fast.

const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequestModel;