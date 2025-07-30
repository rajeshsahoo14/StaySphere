const listing = require("./models/listings.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn=(req,res,next)=>{
    // console.log(req.path,"......",req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be Logged In to create Listing!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=async(req,res,next)=>{
    let{id}=req.params;
     let Listing=await listing.findById(id);
    if(!Listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this property!");
       return  res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewOwner=async(req,res,next)=>{
    let{id,reviewId}=req.params; 
     let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this review!");
       return  res.redirect(`/listings/${id}`);
    }
    next();
}
