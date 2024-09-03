const express=require("express");
const app=express();
const path= require("path");
const mongoose=require("mongoose");
const listing=require("../models/listing.js");
const methodoverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("../utils/wrapAsync.js");
const expressError=require("../utils/expressError.js");
const Joi = require('joi');
const {requieSchema}=require("../schema.js");
const {listingSchema , reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const router=express.Router();
const {validatingReview, isLoggedIn,isReviewAuthor}=require("../middleware.js");

const reviewController=require("../controllers/reviews.js");






//review :POST route
router.post("/listings/:id/reviews",isLoggedIn,validatingReview,wrapAsync(reviewController.createReview));

//delete:delete route
router.delete("/listings/:id/reviews/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));











module.exports=router;