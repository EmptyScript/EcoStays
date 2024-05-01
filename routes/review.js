const express = require("express")
const router = express.Router({mergeParams : true})
const wrapAsync = require("../utils/wrapAsync")
const ExpressError = require("../utils/ExpressError")
const {listingSchema, reviewSchema }= require("../schema")
const listing = require("../models/listing");
const Review = require("../models/review");
const {isLoggedIn, isAuthor}  = require("../middleware")
const { createReviewListing, deleteReview } = require("../controllers/review")
const validateReview = (req,res,next)=> {
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(404, error)
    }
    next();
}

//Create review
router.post("/", isLoggedIn , wrapAsync(createReviewListing))

//Delete Review
router.delete("/:reviewid", isAuthor , wrapAsync(deleteReview))

module.exports = router