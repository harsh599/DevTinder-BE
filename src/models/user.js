const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
     lastName: {
        type: String,
    },
     email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
     password: {
        type: String,
    }
},{
 timestamps:true,
});

userSchema.method.getJWT = async function(){
    const user = user;

        const token = await jwt.sign({ _id: user._id }, 'abcdefghijklmnopqrstuvwxyz',{expiresIn: "1d"});//secret data, private key

        return token;
}

const User = mongoose.model('User',userSchema);

module.exports = User;