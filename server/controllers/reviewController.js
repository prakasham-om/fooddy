import reviewModel from "../models/resturantModel.js";


export const reviewCreate=async(req,res)=>{
    try{
        const review=new reviewModel({
            userId:req.userId,
            rating:req.body.rating,
            review:req.body.review,
            resturantId:req.body.resturantId,
            date:Date.now()
        })
        await review.save();
        res.status(200).json({
            message:"Review added successfully"
        })
    }catch(err){
        res.status(400).json({
            message:err.message
        })
    }
}