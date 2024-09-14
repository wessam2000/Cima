const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "the name field is required "],
        minLength: [3, "the name length must be 3 letter at least"],
        maxLength: [50, "the name length mustn't be more than 50 letter"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "the email field is required "],
        trim: true,
        lowerCase: true,
        validate: {
            validator: validator.isEmail,
            message: "please provide a valid email"
        },
        unique:true
    },
    password: {
        type: String,
        required: [true, "the password field is required "],
        minLength: [8, "the password length must be 8 letter at least"],
        trim: true,
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, "the confirm password field is required "],
        validate: {
            validator: function (confirmPass) {
                return confirmPass === this.password
            },
            message: "the confirm Password doesn't match ..."
        },
        trim: true
    },
    photo: {
        type: String
    },
    changedPasswordAt:Date
});

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
});

UserSchema.methods.comparePassword=async function(candidatePass){
    console.log(this.password);
    
    return await bcrypt.compare(candidatePass, this.password);
};
UserSchema.methods.checkChangePassTime=function(tokenTimeStamp){
    if(this.changedPasswordAt){
        return this.changedPasswordAt.getDate()/1000 > tokenTimeStamp 
    }return false;
}

exports.User = mongoose.model("User", UserSchema);
