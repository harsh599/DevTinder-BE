const mongoose = require('mongoose');

const connection_string = "mongodb+srv://namastedev:SQQCxb3ECPpamlPS@namastenode.g34lj.mongodb.net/devTinder";

const connectDB = async ()=>{
    await mongoose.connect(connection_string);
}

module.exports = connectDB;

