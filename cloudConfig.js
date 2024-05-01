//Requiring 
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage} = require('multer-storage-cloudinary')

//Config 
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET
})

//Telling cloudinary the name of folder where our files(img/video) are saved
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params : {
        folder: "ecostay",
        allowedFormats : ["png", "jpeg", "jpg"],
    }
    })

module.exports = {
    storage,
    cloudinary
}