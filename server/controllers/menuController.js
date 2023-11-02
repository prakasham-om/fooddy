import menuModel from "../models/menuModel.js";

import resturantModel from "../models/resturantModel.js";

export const createMenu=async(req,res)=>{
    
   const user=req.user._id.toString().replace(/ObjectId\("(.*)"\)/,"$1")
   if(user ===req.params.id1){
    const resturantId=await resturantModel.findById(req.params.id2) 
    const Id=resturantId._id.toString().replace(/ObjectId\("(.*)"\)/,"$1")

    console.log(resturantId._id);

    if(req.user.role ==='owner'  && Id=== req.params.id2){
    try{
       const menu =req.body;
       const newMenu=new menuModel(menu);
       await newMenu.save();
       res.status(201).json(newMenu);
    }catch(err){
        res.status(400).json({message:err.message});
    }
    }else{
        res.status(400).json({message:"You are not own any resturant"})
    }
   }else{
    res.status(400).json({message:"unautherized"})
}
}


export const getAllMenu=async(req,res)=>{
    try{
        const menus=await menuModel.find();
        //const [{items}]=menus;
        //const[{price}]=items;
        res.status(200).json(menus)
    }catch(err){
        res.status(400).json({message:err.message});
    }
}

export const updateMenu=async (req,res)=>{
    try{
     
        const user=req.user._id.toString().replace(/ObjectId\("(.*)"\)/,"$1")
       
        const userid=req.params.id1
        const menuId=req.params.id2
        if(user === userid && req.user.role==="owner"){
            const updateMenu=await menuModel.findByIdAndUpdate(menuId,req.body)
            res.status(200).json({updateMenu}); 
        }

     else{
        res.status(400).json({message:"You are not own any resturant"})
    }
    }catch(err){
        res.status(400).json({message:err.message});
    }
}

export const getMenuByResturant =async(req,res)=>{
    try{
        const resturant=await resturantModel.findById(req.params.id);
        if(!resturant){
            return res.status(404).json({message:"Resturant not found"})
        }
        else{
        const menus=await menuModel.find({resturantId:req.params.id});
        res.status(200).json(menus)
        }
    }catch(err){
        res.status(400).json({message:err.message});
    }
}

export const getMenuById=async(req,res)=>{
    try{
        const Id=req.params.id;
        const menu=await menuModel.findById(Id);
        if(!menu){
            return res.status(404).json({message:"Menu not found"})
        }else{
            return res.status(200).json(menu)
        }
    }catch(err){
        res.status(400).json({message:"Something Error",Error:err});
    }
}

export const deleteMenusById = async(req,res)=>{
    if(req.user.role==='owner' && req.user._id === req.params.id1){
       try{
            const id=req.params.id2;
            const menu=await menuModel.findByIdAndDelete(id)
            res.status(200).json({message:"menu deleted successful"})
       }catch{
        res.status(400).json({message:"Something went wrong"})
       }
    }else{
        res.status(400).json({message:"You are not authorized to perform this action"})
    }
}

export const deleteAllMenuByResturant=async(req,res)=>{
    try{
        const resturantId=req.params.id;
        const menus=await menuModel.find({resturantId:resturantId});
       if(!menus){
        return res.status(404).json({message:"Menus not found"})
       }else{
        await menuModel.deleteMany({resturantId:resturantId})
        res.status(200).json({message:"Menus deleted successful"})
       }
        
    }catch{
        res.status(400).json({message:"Something went wrong"})
    }
}