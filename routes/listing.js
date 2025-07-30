const express=require("express");
const router=express.Router();
const listing=require("../models/listings.js");
const wrapAsync=require("../utils/wrapAsync.js");
const listingSchema=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const {isLoggedIn,isOwner}=require("../middleware.js");
const{index, renderNewForm, showListing, createListing, editListing, updateListing, deleteListing}=require("../controllers/listings.js");
const multer  = require('multer');
const{storage}=require("../cloudConfig.js");
const upload = multer({ storage });




// Validate Listing
const validateListing=(req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};




router.route("/")
.get(wrapAsync(index))
.post(isLoggedIn,upload.single('image[url]'),validateListing, wrapAsync(createListing));

// New Route
router.get("/new",isLoggedIn,(renderNewForm));

router.route("/:id")
.get(wrapAsync(showListing))
.put(isLoggedIn,isOwner,upload.single('image[url]'),validateListing, wrapAsync(updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(deleteListing));


// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(editListing));


module.exports=router;