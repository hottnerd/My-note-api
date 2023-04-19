const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/userModel");
const validPassword = require("../utils/validPassword");

const customFields = {
    usernamefield : "username",
    passwordField : "password"
};


const verifyCallback =  async (username,password,done) => {
    try{
        if(!username || !password){
            return done(null,false);
        }
        const user = await User.findOne({username : username}).select("+password").exec();
        if(!user){
            return done(null,false);
        }

        const isValid = await validPassword(password,user.password);
        
        if(isValid){
            return done(null,user);
        }else{
            return done(null,false);
        }
    }catch(err){
        done(err);
    }
};

const localStrategy = new LocalStrategy(customFields,verifyCallback);

passport.use(localStrategy);


passport.serializeUser((user,done)=>{
    done(null,user._id);
});

passport.deserializeUser( async (userId,done)=>{
    try{
        const user = await User.findById(userId);
        if(user){
            return done(null,user);
        }else{
            return done(null,false);
        }

    }catch(err){
        done(err);
    }
    
});