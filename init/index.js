const mongoose = require('mongoose')
const initData = require("./data.js")
const listing = require("../models/listing.js")

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust'
const main = async()=> {
    await mongoose.connect(MONGO_URL)
}
main()
.then(()=> {
    console.log("Connected to DB")
})
.catch((err)=> {
    console.log(err)
})

const initDB = async ()=> {
    await listing.deleteMany({});
    initData.data = initData.data.map((obj)=> ({...obj, owner : "662d3ce80200ad0962312d3b",}))
    await listing.insertMany(initData.data)
    console.log("data was initialized")
}
initDB();