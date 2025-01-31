const mongoose = require('mongoose');

const connection_string = process.env.DB_CONNECTION_STRING;

const connectDB = async ()=>{
    await mongoose.connect(connection_string);
}

module.exports = connectDB;

