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
const {validateListing} = require("../middleware")

router.route("/")
.get(wrapAsync(index))  //index
.post( isLoggedIn , upload.single('listing[image][url]') , validateListing , wrapAsync(createListing)) //create route 






//create new 
router.get("/new", isLoggedIn, wrapAsync(renderNewForm)
)

router.route("/:id")
.get( wrapAsync(showListing)) //show route
.put( isLoggedIn , isOwner , upload.single('listing[image][url]') , validateListing, wrapAsync( editListing)) //edit route
.delete( isLoggedIn, isOwner, wrapAsync(deleteListing)) ///del route

//edit route form
router.get("/:id/edit", isLoggedIn , isOwner , wrapAsync(renderEditForm))



module.exports = router