const listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReviewListing = (async(req,res)=> {
    let listings = await listing.findById(req.params.id)
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id
    listings.reviews.push(newReview)
    await newReview.save()
    await listings.save()
    console.log("Review saved")
    req.flash("successs", "Review Added !!")
    res.redirect(`/listings/${listings._id}`)
}
)

module.exports.deleteReview = (async(req,res)=> {
    let {id,reviewid} = req.params
    await listing.findByIdAndUpdate(id, {$pull: {reviews : reviewid}})
    await Review.findByIdAndDelete(reviewid)
    req.flash("successs", "Review Deleted !!")
    res.redirect(`/listings/${id}`)
})