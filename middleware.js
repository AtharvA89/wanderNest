const listing = require("./models/listing");
const Review = require("./models/review.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const expressError = require("./utils/expressError.js");

module.exports.isLoggedIn = (req, res, next) => {
  console.log(req.path, "..", req.originalUrl);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "to create listing, you need to login");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let Listing = await listing.findById(id);
  if (!Listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "you dont have permission!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validatingListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body.error);
  if (error) {
    throw new expressError(400, result.error);
  } else {
    next();
  }
};

module.exports.validatingReview=(req,res,next)=>{
    let {error} =reviewSchema.validate(req.body.error);
    if(error){
        throw new expressError(400,result.error);
    }else{
        next();
    }
};


module.exports.isReviewAuthor = async (req, res, next) => {
  let { id,reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "you are not the author of the review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};