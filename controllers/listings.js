const listing=require("../models/listings.js");

module.exports.index=async(req,res)=>{
   const allListing=await listing.find({});
    res.render("listings/index.ejs",{allListing});
}

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs")
}

module.exports.showListing=async(req,res)=>{
    let{id}=req.params;
    const listingShow=await listing.findById(id).populate({path:"reviews",populate:"author"}).populate("owner");
    if(!listingShow){
        req.flash("error","Uhh-Ohh, Listing Does Not Exits!!")
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{id,listingShow});
}

module.exports.createListing=async (req, res, next) => {
    let url=req.file.path;
    let filename=req.file.filename;
    let { title, description, image, price, location, country } = req.body;
    // if (!title || !description || !price || !location || !country) {
    //     throw new ExpressError(400, "Send valid data");
    // }
    const newListing = new listing({ title, description, image: {
            url: req.file?.path,
            filename: req.file?.filename
        }, price, location, country });
    newListing.owner=req.user._id;
    newListing.image={url,filename}; 
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}

module.exports.editListing=async(req,res)=>{
    let{id}=req.params;
    const list=await listing.findById(id);
     if(!list){
        req.flash("error","Uhh-Ohh, Listing Does Not Exits!!")
        return res.redirect("/listings");
    }
    let originalImageUrl=list.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{id,list,originalImageUrl});
}

module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    let { title, description, image, price, location, country } = req.body;

    if (!title || !description || !price || !location || !country) {
        throw new ExpressError(400, "Send valid data");
    }
    let editedListing=await listing.findByIdAndUpdate(id, {
        title, description, image, price, location, country
    }, { new: true, runValidators: true });
    
    if(typeof req.file !=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    editedListing.image={url,filename};
    await editedListing.save()
    }

    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing=async(req,res)=>{
    let{id}=req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}