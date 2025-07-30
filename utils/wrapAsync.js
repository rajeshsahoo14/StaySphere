// We can even write this function as arrow function
function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch(next);
    }
}
module.exports=wrapAsync;