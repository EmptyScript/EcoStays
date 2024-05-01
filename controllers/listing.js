const listing = require("../models/listing")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async(req,res)=> {
    if(req.query.category){
        const requestedCategory = req.query.category
        const alllistings = await listing.find({category : requestedCategory })
        return res.render("listings.ejs",{alllistings})
    }
    if(req.query.query){
        const query = req.query.query
        const alllistings = await listing.find({
            $or: [
                { title: { $regex: query, $options: 'i' } }, // Case-insensitive search
                { country: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } },
                // Add more fields as needed
              ]
        })
        return res.render("listings.ejs",{alllistings})
    }
    const alllistings = await listing.find({});
    res.render("listings.ejs",{alllistings})
    
}

module.exports.renderNewForm =  (req,res)=> {
    res.render("new.ejs") }

module.exports.createListing =  async(req,res, next)=>{
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      }).send()
    
    let url = req.file.path;
    let filename = req.file.filename
    const newListing = new listing(req.body.listing)
    console.log(req.body.listing)
    newListing.owner = req.user._id
    newListing.image = {url, filename}
    newListing.geometry = response.body.features[0].geometry
    let savedListing =await newListing.save()
    newListing.category = req.body.category;
    console.log(savedListing)
    req.flash("successs", "New listing created !!")
    res.redirect("/listings")
}

module.exports.showListing = async(req,res)=> {
    let {id} = req.params;
    const listings= await listing.findById(id).populate({path : "reviews", populate : {path : "author"}}).populate('owner');
    if(!listings){
        req.flash("error","Listing doesnt exist")
       return  res.redirect("/listings")
    }
    res.render("show.ejs", {listings});
    
}


module.exports.renderEditForm  = async (req,res)=>{
    let {id} = req.params;
    const listings = await listing.findById(id);
    let originalImageUrl = listings.image.url
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_100,w_100")
    res.render("edit.ejs",{listings, originalImageUrl})
}

module.exports.editListing = async(req,res)=> {
    let {id} = req.params;
    let filename = req.file.filename
    const listings =  await listing.findByIdAndUpdate(id,{...req.body.listing})
    if(req.file !== "undefined"){
        let filename = req.file.filename
        let url = req.file.path
        listings.image = {url, filename}
    await listings.save()
    }
    
    if(!listings){
        req.flash("error","Listing doesnt exist")
        res.redirect("/listings")
    }
    req.flash("successs", "Listing Updated Succesfully")
    res.redirect(`/listings/${id}`)
}
module.exports.deleteListing = async(req,res)=> {
    let {id} = req.params;
    await listing.findByIdAndDelete(id)
    req.flash("successs", "Listing Deleted")
    res.redirect("/listings")
}