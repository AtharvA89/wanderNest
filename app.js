if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

console.log(process.env.SECRET);

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const Joi = require("joi");
const { requieSchema } = require("./schema.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/reviews.js");
const user = require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

//const MOGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const dbUrl=process.env.ATLASDB_URL;

main()
  .then((res) => {
    console.log("connected to server");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

const store= MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
});

store.on("error",()=>{
  console.log("error found in MONGO SESSION STORE",err);
})

const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 50 * 50 * 1000,
    httmpOnly: true,
  },
};



// app.get("/", (req, res) => {
//   res.send("working on it");
// });

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/demoUser", async (req,res) => {
//   const fakeuser = new User({
//     email: "ak@gmail.com",
//     username: "aksk",
//   });
//   let registerUser = await User.register(fakeuser, "helloworld");
//   res.send(registerUser);
// });

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  console.log(res.locals.success);
  next();
});

//router:adding routes
app.use("/", listings);
app.use("/", reviews);
app.use("/", user);

const validatingListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body.error);
  if (error) {
    throw new expressError(400, result.error);
  } else {
    next();
  }
};

const validatingReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body.error);
  if (error) {
    throw new expressError(400, result.error);
  } else {
    next();
  }
};

// testing route
// app.get("/listingtest",(req,res)=>{
//     let samplelisting=new listing({
//         title:"villa",
//         description:"near beach",
//         price:1900,
//         location:"goa",
//         country:"india",
//     });

//     samplelisting.save().then(res=>{
//         console.log("listing was saved");
//     }).catch(err=>{
//         console.log(err);
//     })

//     res.send("response savedd")
// });

//general error
app.use("*", (req, res, next) => {
  next(new expressError(404, "page not found!"));
});

//ERROR handling
app.use((err, req, res, next) => {
  let { statusCode, message } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("listerning to 8080 port");
});
