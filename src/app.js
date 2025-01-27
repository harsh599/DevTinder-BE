const express = require('express');
const app = express();
const port = 7777;
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");


app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);



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

