const express = require("express");
const passport = require("passport");
const {requireAuth , isAdmin} = require("../middlewares/auth");
const {userRegister,
    userData,
    userLogin,
    userLogout,
    userDelete,
    userAddadmin,
    userDeleteadmin,
    getUsers
  } = require("../controllers/userControllers");

const userRouter = express.Router();

userRouter.get("/",requireAuth,userData);

userRouter.post("/register",userRegister);

userRouter.post("/login",passport.authenticate("local"),userLogin);

userRouter.post("/logout",requireAuth,userLogout);

userRouter.delete("/admin/delete/:userId",requireAuth,isAdmin,userDelete);

userRouter.post("/admin/add/:userId",requireAuth,isAdmin,userAddadmin);

userRouter.post("/admin/delete/:userId",requireAuth,isAdmin,userDeleteadmin);

userRouter.get("/admin/users",requireAuth,isAdmin,getUsers);

module.exports = userRouter;