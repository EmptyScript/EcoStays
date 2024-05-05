if(process.env.NODE_ENV != "production"){
    require("dotenv").config()
}
const express = require('express');
const app=express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const Review = require("./models/review.js");
const path = require("path")
const methodOverride = require("method-override")
const dns = require('dns');
const ejsMate = require("ejs-mate")
app.engine("ejs", ejsMate)
const wrapAsync = require("./utils/wrapAsync")
const ExpressError = require("./utils/ExpressError")
const {listingSchema, reviewSchema , userSchema}= require("./schema")
const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const MongoStore = require('connect-mongo');
const flash = require("connect-flash")
const passport = require("passport")
const localStrategy = require("passport-local")
const User = require("./models/user.js")
const userRouter = require("./routes/user.js")
const dbUrl = process.env.ATLASDB_URL
const main = async()=> {
    await mongoose.connect(dbUrl)
}
app.use(cookieParser())
const Joi = require('joi')
app.use(methodOverride("_method"))
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"))
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}))
main()
.then(()=> {
    console.log("Connected to DB")
})
.catch((err)=> {
    console.log(err)
})
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto : {
        secret : process.env.SECRET
    },
    touchAfter :  30 * 60  // 30 mins

})

store.on("error", ()=> {
    console.log("Error in Mongo session store",err);
})
const sessionOptions =  {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized :true,
    cookie : {
        expires : Date.now() + 7* 24 * 60 * 60 * 1000, //a week
        maxAge : 7* 24 * 60 * 60 * 1000,
        httpOnly : true
    },
}

app.use(session(sessionOptions))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=> {
    res.locals.success = req.flash("successs")
    res.locals.failure = req.flash("error")
    res.locals.currentUser = req.user
    next();
})




app.get("/", (req,res)=> {
    res.redirect("/listings")
})

app.get("/demouser", async(req,res)=> {
    let fakeUser = new User({
        email : "student@gmail.com",
        username : "student2"
    })
    let newUser = await User.register(fakeUser, "helloworld")
    res.send(newUser)
})

app.get("/listings/test", (req,res)=> {
    console.log('Received Data:',req.body)
    res.json({message : "Data saved succesfully"})
})
app.listen(3000, ()=> {
    console.log("Listeining on port 3000")
});

app.use("/listings", listingRouter)
app.use("/listings/:id/reviews", reviewRouter)
app.use("/", userRouter)

//test route
// app.get("/testListing", async (req,res)=> {
//     let sampleListing = new listing({
//         title : "Shubham Inc",
//         description : "Its a villa of dreams, by the beach",
//         image : " ",
//         price : 7999,
//         location : "Jaipur",
//         Country : "India"
//     })

//     await sampleListing.save()
//     console.log("Sample was saved")
//     res.send("Succesful")
// })

app.all("*", (req,res,next)=> {
    next(new ExpressError(404,"Page Not found"))
})

app.use((err,req,res,next)=> {
    let {status=500 , message="Error"} = err;
    res.render("error.ejs", {message})
    // res.status(status).send(message);
})

