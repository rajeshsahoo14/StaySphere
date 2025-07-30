if(process.env.NODE_ENV !="production"){
    require('dotenv').config()
}
// console.log(process.env.SECRET)

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const listing=require("./models/listings.js");
const path=require("path");
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const listingSchema=require("./schema.js");
const Review=require("./models/review.js");
const{reviewSchema}=require("./schema.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


const listingRoute=require("./routes/listing.js");
const reviewRoute=require("./routes/review.js");
const userRoute=require("./routes/user.js");



// const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';
const dbUrl=process.env.ATLASDB_URL;

main().then(()=>{
    console.log("connected to DB");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

app.engine('ejs', engine);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

const sessionOption={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};


app.use(session(sessionOption));
app.use(flash());

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
   res.locals.success=req.flash("success");
   res.locals.error=req.flash("error");
   res.locals.currUser=req.user;
    next();
});




// app.get("/",(req,res)=>{
//     res.send("Hi,this is home page");
// });

// app.get("/testlisting",async(req,res)=>{
//     let sampleListing=new listing({
//         title:"Taj By Vivanta",
//         description:"Near the Beach",
//         price:1299,
//         location:"Guwahati,Assam",
//         country:"India",
//     });
//     await sampleListing.save().then((res)=>{
//         console.log(res);
//     }).catch((err)=>{
//         console.log(err);
//     });
//     console.log("sample collected");
//     res.send("success");
// });







app.use("/listings",listingRoute);
app.use("/listings/:id/reviews",reviewRoute);
app.use("/",userRoute);







// app.all("*",(req,res,next)=>{
//     throw new ExpressError(404,"Page Not Found!!");
// });

app.use((err,req,res,next)=>{
    console.log("Error:",err);
    let{status=500,message="Error Occurred"}=err;
    res.status(status).render("error.ejs",{message});
    // res.status(status).send(message);
});

app.listen(3000,()=>{
    console.log("listening to server on port");
});