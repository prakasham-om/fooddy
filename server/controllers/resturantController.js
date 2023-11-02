import resturantModel from "../models/resturantModel.js";
import userModel from "../models/userModel.js";
export const newResturant=async(req,res,next)=>{
    try{
        const {name,address,cuisine} = req.body
      
        // const existResturant=resturantModel.findOne({name:name,address:address});
        // if(existResturant){
        //     return res.status(400).json({message:"Resturant already exist"})
        // }

        const resturant=new resturantModel({name,address,cuisine})
    
        resturant.ownerId=req.user._id;

        await resturant.save()
         req.user.role="owner"
        req.user.save()
        res.status(201).json({message:"Resturant created successfully",result:req.user.role})

       // next();
        
        
    }
    catch{
        res.status(404).json({message:"Something went wrong"})
    }
}


export const getResturants=async(req,res)=>{
    try{
        const resturants=await resturantModel.find();
        return res.status(200).json(resturants)
    }
    catch{
        res.status(404).json({message:"Something went wrong"})
    }
}

export const getResturantbyId=async(req,res)=>{
    try{
        const resturant=await resturantModel.findById(req.params.id);
        if(!resturant){
            return res.status(404).json({message:"Resturant not found"})
        }
        return res.status(200).json(resturant)
    }
    catch{
        res.status(404).json({message:"Something went wrong"})
    }
}

export const updateResturant=async(req,res)=>{
    const userId=req.user._id.toString().replace(/ObjectId\("(.*)"\)/,"$1")
    if(req.user.role ==='owner'  && userId=== req.params.id1){
    try{
        const resturant=await resturantModel.findById(req.params.id2);
        if(!resturant){
            return res.status(404).json({message:"Resturant not found"})
        }
        const {name,address,cuisine} = req.body
        resturant.name=name;
        resturant.address=address;
        resturant.cuisine=cuisine;
        await resturant.save();
        return res.status(200).json(resturant)
    }
    catch{
        res.status(404).json({message:"Something went wrong"})
    }
}
  return res.status(200).json({message:"You are not a owner"});
}

export const deleteResturant=async(req,res)=>{
    console.log(req.params.id);
    const role=req.user.role   
    const userId=req.user._id.toString().replace(/ObjectId\("(.*)"\)/,"$1")
   // console.log(userId);
    if(role ==='owner'  && userId=== req.params.id1){
        
           const resturant= await resturantModel.findOneAndDelete({_id:req.params.id2})
           req.user.role="user";
           await req.user.save();
                res.status(200).json({message:"Resturant deleted successfully",resturant})
                
            }
            else{
                res.status(400).json({message:"You are not a own any resturant"})
            }

}