const express=require("express");
const router=express.Router({mergeParams:true});
const{reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const listing=require("../models/listings.js");
const{isLoggedIn,isReviewOwner}=require("../middleware.js");

const{createReview, destroyReview}=require("../controllers/reviews.js");






// Review Validation
const validateReview=(req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};



// Review 
// POST ROUTE
router.post("/",isLoggedIn,validateReview,wrapAsync(createReview));

// DELETE ROUTE
router.delete("/:reviewId",isLoggedIn,isReviewOwner,wrapAsync(destroyReview));

module.exports=router;





