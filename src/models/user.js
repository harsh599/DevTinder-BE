const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      validate(value) {
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: `{VALUE} is not a valid gender type`,
      },
      // validate(value) {
      //   if (!["male", "female", "others"].includes(value)) {
      //     throw new Error("Gender data is not valid");
      //   }
      // },
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    membershipType: {
      type: String,
    },
    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
    //   validate(value) {
    //     if (!validator.isURL(value)) {
    //       throw new Error("Invalid Photo URL: " + value);
    //     }
    //   },
    },
    about: {
      type: String,
      default: "This is a default about of the user!",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.method.getJWT = async function(){
    const user = user;

        const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY,{expiresIn: "1d"});//secret data, private key

        return token;
}

const User = mongoose.model('User',userSchema);

module.exports = User;