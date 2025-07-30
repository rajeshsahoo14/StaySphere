const mongoose=require("mongoose");
const Listing=require("../models/listings.js");
const listing = require("./data.js");

main().then(()=>{
    console.log("connected to DB");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB=async()=>{
    await Listing.deleteMany({});
    const listingWithOwner=listing.map((obj)=>({...obj,owner:"6885528324b9712a3503addf"}));
    await Listing.insertMany(listingWithOwner);
    console.log("Data Intialized successfully");
}
initDB();


