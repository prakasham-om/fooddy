import orderModel from "../models/orderModel.js";

import menuModel from "../models/menuModel.js";

import { ObjectId } from "mongodb";

 
export const createOrder=async(req,res)=>{
    try{
        const userId=req.user._id;
        
        const resturantId=req.body.resturantId;

        const itemsId=req.body.itemsId;
        console.log(itemsId)
        

        const getItem=await menuModel.findById({_id:itemsId}) 
        const {items}=getItem
        const [{price}]=items
          //check item already exist or not
          let quantity=1;
          const orderItem=await orderModel.findOne({items:items})
          if(orderItem){
            console.log(orderItem);
           quantity+=orderItem.quantity;
           orderItem.userId=orderItem.userId;
           orderItem.resturantId=orderItem.resturantId;
           orderItem.items=orderItem.items;
           orderItem.total=orderItem.total+price;
           orderItem.quantity=quantity;

             await orderItem.save();

           res.status(200).json({message:"order added successfully"})
          }else{
        const order=new orderModel({userId, resturantId,items,total:price,quantity})
        const savedOrder=await order.save();
        res.status(201).json({
            message:"Order Created",
            order:savedOrder
        })}
    }catch(err){
        console.log(err);
        return res.status(400).json({
            message:"Bad Request"
        })
    }
}

export const getOrdersByUser=async(req,res)=>{
    try{
        const userId=req.user._id;
        const orders=await orderModel.find({userId:userId});
        res.status(200).json({
            message:"orders fetched successfully",
            orders:orders
        })

    }catch{
        res.status(400).json({
            message:"Bad Request"
        })
    }
}

export  const removeOrder=async(req,res)=>{

try{
        
    const orderId=req.params.id;

    const order=await orderModel.findById(orderId);
    if(!order){
        res.status(200).json({message:"You have no order from this id"})
    }
  else{
   if(order.quantity > 1){
      order.quantity--;
      await order.save();
      res.status(200).json({
          message:"Order removed successfully"
      })   
    }else{
        await order.remove();
        res.status(200).json({
            message:"Order removed successfully"
         })
        }
    }

}
catch(err){
    console.log(err);
    return res.status(400).json({
        message:"Bad Request"
    })
}

}

export const removeAllSimilarOrder=async(req, res) => {
    
    try{
        const Id=req.params.id;
        console.log(Id)
        const order=await orderModel.findById(Id);


        if(!order){
            res.status(200).json({message:"You have no order from this id"})
        }
        else{
        await orderModel.findByIdAndDelete(Id)
        res.status(200).json({
            message:" orders removed successfully"
            })
        }
    }
    catch{
        return res.status(400).json({
            message:"Bad Request"
        })
    }
}

export const removeAllOrders=async(req,res)=>{
    const userId=req.user._id;
    try{
        const order=await orderModel.find({userId:userId})
        console.log(order.length)

        if(order.length ===0){
            res.status(200).json({message:"You have no order to display"})
        }
       else{
       await orderModel.deleteMany({userId:userId});
        res.status(200).json({
            message:"All orders removed successfully"
            })
        }
    }
    catch{
        return res.status(400).json({
            message:"Bad Request"
        })
    }

}