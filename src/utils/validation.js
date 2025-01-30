const validator = require("validator");

const validateSignUpData = (req)=>{
    const {firstName, lastName, emailId, password} = req.body;
     if(!firstName || !lastName){
        console.log("First name is absent");
        throw new Error("Name is not valid!!");
    }
    else if(firstName.length < 4 || firstName.length > 50){
        console.log("Firstname is not valid!!");
        throw new Error("Name is not valid!!");
    }else if(!validator.isEmail(emailId)){
        console.log("Email is not valid!!");
        throw new Error("Email is not valid!!");
    }else if(!validator.isStrongPassword(password)){
        console.log("Password is not valid!!");
        throw new Error("Password is not strong!!");
    }
}

const validateEditProfileData = (req) => {
    const allowedEditFields = ["emailId", "firstName", "lastName", "age", "gender", "photoUrl", "about", "skills"];

    const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));

    return isEditAllowed;
}

module.exports = {validateSignUpData, validateEditProfileData}