const { Schema, model } = require("mongoose");


const noteSchema = new Schema({
    userId:{type:Schema.Types.ObjectId, ref : "User" , required:true},
    title : { type : String , required : true},
    text : { type : String,required:true}   
}, { timestamps : true})


module.exports = model("Note", noteSchema)