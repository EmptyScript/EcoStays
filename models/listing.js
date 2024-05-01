const mongoose = require("mongoose")
const Schema = mongoose.Schema; //so from next time, we dont need to write mongoose.Schema but just Schema
const Review = require("./review.js")
const listingSchema = new Schema({
    title : {
        type : String
    },
    description : String,
    image : {
        type : Object,
        default : {
            filename : "listingimage",
            url : "https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg"
        },
        set: v => (
            (!v || typeof v !== "object") ?  // Condition 1: If 'v' is falsy or not an object
            { filename: "listingimage", url: "https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg" } : // Result if Condition 1 is true
            { filename: v.filename || "listingimage", url: v.url === "" ? "https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg" : v.url } // Result if Condition 1 is false
        )
        
    },
    price : Number,
    location : String,
    country : String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        },
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        },
    },
        category : {
            type : String,
            required : true,
            enum : ['Haunted House', 'Arctic', 'Resorts' , 'Castles' , 'House-boats' , 'Dorms' , 'Mountain-View' , 'Camping' , 'Pools' , 'Palace' ,'Sea-view' , 'Villa' ,'Rooms']
        }
})
listingSchema.post("findOneAndDelete", async(listing)=> {
    if(listing) {
        await Review.deleteMany({ _id : {$in: listing.reviews}})
    }
})

const listing = mongoose.model("Listing", listingSchema);
module.exports = listing

