import locationModel from "../models/locationModel.js";

export const createLocation=async(req,res)=>{
    const location=new locationModel({
        city:req.body.city,
        coordinates:{
            latitude:req.body.latitude,
            longitude:req.body.longitude,
        },
        userId:req.user._id
    })
    await location.save();
    res.status(201).json(location);
}