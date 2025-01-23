const express = require('express');
const app = express();
const port = 7777;
const connectDB = require("./config/database");
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async(req,res)=>{
    console.log(req.body);
    const user = new User(req.body);// creating a new instance of the User Model
    try{
        await user.save();
        res.send("User Added successfully!!");
    }catch(err){
        res.status(500).send("User Add operation failed!!");
    }

});

//Get user by email
app.get("/user", async(req, res)=>{
    const userEmail = req.body.email;
    try{
       const user = await User.find({email: userEmail});
       res.send(user);
    }catch(err){
        res.status(404).send("Something went wrong!!");
    }

});

app.get("/feed", async(req, res) => {
   const userEmail = req.body.email;
    try{
       const user = await User.find();
       res.send(user);
    }catch(err){
        res.status(404).send("Something went wrong!!");
    }
});

connectDB()
.then(()=>{
    //First Connect to Database then only start the server
    console.log("Database Connection successfully established!");
    app.listen(port, ()=>{
         console.log('listening on port '+port);
    });
})
.catch((err)=>{
    console.log("Database Connection Failed!!", err);
});

