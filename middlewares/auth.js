const createHttpError = require("http-errors")
const requireAuth = (req,res,next) =>{

    if(req.isAuthenticated()){
        next();
    }else{
        next(createHttpError(401,"User not authenticated"))
    }
};

const isAdmin = (req,res,next) => {
    if(req.user.admin){
        next()
    }else{
        next(createHttpError(403,"User not permitted"))
    }
};

module.exports = {requireAuth,
                  isAdmin
                 }