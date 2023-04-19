const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const dbconnect = require("./config/dbConfig");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const passport = require("passport");
const {isHttpError} = require("http-errors");
const createHttpError = require("http-errors");
const userRouter = require("./routers/userRouter");
const noteRouter = require("./routers/noteRouter");
const { requireAuth } = require("./middlewares/auth");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

dbconnect();

app.use(morgan("dev"));

app.use(cors(corsOptions));

app.use(express.json());

app.use(session({
    secret : process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized: false,
    cookie:{
        maxAge: 1000 * 60 * 60 ,
        sameSite : "none",
        secure : true
    },
    rolling:true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
}))

require("./config/passport");

app.use(passport.initialize());
app.use(passport.session());


app.use("/api/user",userRouter);
app.use("/api/note",requireAuth,noteRouter);


app.use((req,res,next)=>{
    try {
        throw createHttpError(404,"Endpoint not found");
    } catch(err){
        next(err);
    }
})

app.use((err,req,res,next)=>{
    console.log(err)
    let errorMessage = "Unknown error occured"
    let statusCode = 500
    if(isHttpError(err)){
        statusCode = err.status
        errorMessage = err.message
    }
    res.status(statusCode).json({error : errorMessage})
});

app.listen(PORT,()=>{
    console.log(`server running at port ${PORT}`)
})
