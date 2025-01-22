const express = require('express');
const app = express();
const port = 7777;


app.use("/",(req,res)=>{
    res.send("Welcome to Node Js Server!");
});


app.use("/test",(req,res)=>{
    res.send("Welcome to Node Js Server from Test route!");
});


app.listen(port, ()=>{
    console.log('listening on port '+port);
});
