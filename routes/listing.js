const express = require("express")
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync")
const ExpressError = require("../utils/ExpressError")
const {listingSchema, reviewSchema}= require("../schema")
const listing = require("../models/listing");
const {isLoggedIn , isOwner} = require("../middleware")
const {index, renderNewForm , createListing , showListing, renderEditForm , editListing , deleteListing } = require("../controllers/listing")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage})
const validateListing = (req,res,next)=> {
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(404, error)
    }
    next();
}

router.route("/")
.get(wrapAsync(index))  //index
.post( isLoggedIn , validateListing, upload.single('listing[image][url]') , wrapAsync(createListing)) //create route 






//create new 
router.get("/new", isLoggedIn, wrapAsync(renderNewForm)
)

router.route("/:id")
.get( wrapAsync(showListing)) //show route
.put( isLoggedIn , isOwner , upload.single('listing[image][url]') , wrapAsync( editListing)) //edit route
.delete( isLoggedIn, isOwner, wrapAsync(deleteListing)) ///edit route

//edit route
router.get("/:id/edit", isLoggedIn , isOwner , wrapAsync(renderEditForm))



module.exports = router