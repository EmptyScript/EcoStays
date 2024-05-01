const listing = require("./models/listing")
const Review = require("./models/review")
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