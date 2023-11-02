import mongoose from "mongoose"


const reviewSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    rating:{
        type:Number,
        required:true,
    },
    review:{
        type:String,
        required:true,
    },
    resturantId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Resturant",
        required:true,
    },
    date:Date
})


const reviewModel =mongoose.model('Review',reviewSchema);

export default reviewModel;