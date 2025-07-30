const mongoose=require("mongoose");
const Review = require("./review.js");
const Schema=mongoose.Schema;
const listingSchema = new mongoose.Schema({
  title: {
    type:String,
    required:true
  },
  description: String,
  image: {
      url:String,
      filename:String,
  },
  price:  {
    type:Number,
    required:true
  },
  location: String,
  country: String,
  reviews:[
    {
    type:mongoose.Schema.Types.ObjectId,
    ref:"Review",
  },
],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
  },
});

listingSchema.post("findOneAndDelete",async(data)=>{
  if(data){
    await Review.deleteMany({_id:{$in:data.reviews}});
  }
});

const listing=mongoose.model("listing",listingSchema);
module.exports=listing;

