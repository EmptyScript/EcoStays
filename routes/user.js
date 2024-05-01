const express = require("express")
const router = express.Router()
const User = require("../models/user.js")
const wrapAsync = require("../utils/wrapAsync.js")
const passport = require("passport")
const {saveRedirectUrl} = require("../middleware.js")
const { rendersignupForm, signupRoute, renderLoginForm, loginRoute ,logoutRoute } = require("../controllers/users.js")


router.get("/signup", rendersignupForm )
router.post("/signup", wrapAsync(signupRoute))

router.get("/login", renderLoginForm)

router.post("/login", saveRedirectUrl, passport.authenticate("local", {failureRedirect : '/login', failureFlash : true }), loginRoute)

router.get("/logout" , logoutRoute)

module.exports = router

