import mongoose from 'mongoose';

const orderSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    resturantId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Resturant",
        required:true,
    },
    items:[String],

    total:{
        type:Number,
        required:true,
    },
    quantity:{
        type:Number,
    },
    status:{
        type:String,
        required:true,
        enum:['Pending','Delivered'],
        default:'Pending',
    },
});




const orderModel = mongoose.model('Order',orderSchema);



export default orderModel;