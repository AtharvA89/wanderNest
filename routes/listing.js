const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const listing = require("../models/listing.js");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const Joi = require("joi");
const { requieSchema } = require("../schema.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const router = express.Router();
const { isLoggedIn, isOwner, validatingListing } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const listingController = require("../controllers/listings.js");

//index route::::listing the location list
//create route
router
  .route("/listings")
  .get(validatingListing, wrapAsync(listingController.index))
  .post(
    upload.single("listing[image]"),
    validatingListing,
    wrapAsync(listingController.createListing)
  );

//new route
router.get("/listings/new", isLoggedIn, listingController.renderNewForm);

//show route: get the document on basis of id
//edit update route
router
  .route("/listings/:id")
  .get(validatingListing, wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validatingListing,
    wrapAsync(listingController.updateListing)
  );

//edit route
router.get(
  "/listings/:id/edit",
  isLoggedIn,
  isOwner,
  validatingListing,
  wrapAsync(listingController.renderEditForm)
);

//delete
router.delete(
  "/listings/:id/delete",
  isLoggedIn,
  isOwner,
  validatingListing,
  wrapAsync(listingController.destroyListing)
);

module.exports = router;
