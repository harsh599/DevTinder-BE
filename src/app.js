require('dotenv').config({ path: './.env' });
const express = require('express');
const app = express();
const port = process.env.APP_PORT;
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.sendStatus(204); // No content response for preflight
});

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

