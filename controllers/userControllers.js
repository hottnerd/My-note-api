const createHttpError = require("http-errors");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const userRegister = async (req,res,next) => {
    const username = req.body.username;
    const passwordRaw = req.body.password;
    const email = req.body.email;

    try {
        if(!username ||  !passwordRaw || !email){
            throw createHttpError(400,"Params missing")
        }

        const existingUsername = await User.findOne({username:username}).exec();

        if(existingUsername){
            throw createHttpError(409,"Username already existed.");
        }

        const existingEmail = await User.findOne({email:email}).exec();
        
        if(existingEmail){
            throw createHttpError(409,"This e-mail has already been used.");
        }

        const passwordHashed = await bcrypt.hash(passwordRaw,10)
        
        const newUser = await User.create({
            username:username,
            password:passwordHashed,
            email:email
        })

        res.status(201).json(newUser)
    } catch (err) {
        next(err)
    }
};

const userLogin = (req,res,next) => {
    res.status(200).json({message:"login successfully"});
};

const userLogout = (req,res,next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.status(200).json({message:"logout successfully"});
      });
};

const userDelete = async (req,res,next) => {
    const userId = req.params.userId;
    try {
        if(!mongoose.isValidObjectId(userId)){
            throw createHttpError(400,"Invalid user ID");
        }

        const user = await User.findById(userId).exec();

        if(!user){
            throw createHttpError(404,"User not found");
        }

        await User.deleteOne({ _id: user._id });

        res.sendStatus(204);

    } catch (err) {
        next(err);
    }
};

const userAddadmin = async (req,res,next) => {
    const userId = req.params.userId;

    try {
        if(!mongoose.isValidObjectId(userId)){
            throw createHttpError(400,"Invalid user ID");
        }

        const user = await User.findById(userId).exec()

        if(!user){
            throw createHttpError(404,"User not found");
        }

        user.admin = true;

        await user.save();

        res.sendStatus(200);

    } catch (err) {
        next(err);
    }
};

const userDeleteadmin = async (req,res,next) => {
    const userId = req.params.userId;

    try {
        if(!mongoose.isValidObjectId(userId)){
            throw createHttpError(400,"Invalid user ID");
        }

        const user = await User.findById(userId).exec()

        if(!user){
            throw createHttpError(404,"User not found");
        }

        user.admin = false;

        await user.save();

        res.sendStatus(200);

    } catch (err) {
        next(err);
    }
};

const userData = (req,res,next) => {
    res.status(200).json(req.user);
};

const getUsers = async (req,res,next) => {
    try {
        const users = await User.find({}).exec();
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
};


module.exports = {userRegister,
                  userLogin,
                  userData,
                  userLogout,
                  userDelete,
                  userAddadmin,
                  userDeleteadmin,
                  getUsers
                };