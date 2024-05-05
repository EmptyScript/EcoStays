const listing = require("./models/listing")
const Review = require("./models/review")
const {userSchema, reviewSchema, listingSchema} = require("./schema")
const dns = require("dns");
const ExpressError = require("./utils/ExpressError")
module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl
        req.flash("error", "you must be logged in !!!")
        return res.redirect("/listings")
    }
    next();
} 

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next();
}

module.exports.isOwner = async (req,res,next)=> {
    let {id} = req.params;
    let listings = await listing.findById(id)
    if(!listings.owner.equals(res.locals.currentUser._id)) {
        req.flash("error","You are not the owner of this listing")
        return res.redirect(`/listings/${id}`)
    }
    next()
}

module.exports.isAuthor = async ( req,res,next) => {
    let {id,reviewid} = req.params;
    let review = await Review.findById(reviewid)
    if(!review.author.equals(res.locals.currentUser._id)) {
        req.flash("error","You are not the author of this review")
        return res.redirect(`/listings/${id}`)
    }
    next()
}


module.exports.validateListing = (req,res,next)=> {
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(404, error)
    }
    next();
}

module.exports.validateReview = (req,res,next)=> {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(404, error)
    }
    next();
}

module.exports.validateSignup = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        throw new ExpressError(404, error)
    }
    next();
};

module.exports.isValidDomain = async (req, res, next) => {
    const { email } = req.body;
    const [, domain] = email.split('@');
    try {
        await dns.promises.resolveMx(domain);
        next(); // Domain has MX records, proceed to next middleware or route handler
    } catch (error) {
        console.error(error); // Log the error for debugging
        throw new ExpressError(404, error);
    }
};
