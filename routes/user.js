const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

//render signup
//signup
router
  .route("/signup")
  .get(userController.renderSignup)
  .post(wrapAsync(userController.signup));

//render login
//login

router
  .route("/login")
  .get(userController.renderLogin)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "./login",
      failureFlash: true,
    }),
    userController.login
  );

//logout page
router.get("/logout", userController.logout);

module.exports = router;
