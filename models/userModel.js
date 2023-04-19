const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    username: {type:String,required:true,unique:true},
    password:{type:String,required:false,select:false},
    email:{type:String,required:true,select:true,unique:true},
    admin:{type:Boolean,required:false,select:true,default:false}
})

module.exports = model("User",userSchema)