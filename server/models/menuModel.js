 import mongoose from 'mongoose';


const menuSchema=new mongoose.Schema({
    resturantId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Resturant",
        required:true,
    }, 
    
    items:[{
        name:String,
        price:Number,
        description:String,
        image:[String],
    }]
})


const menuModel=mongoose.model('Menu',menuSchema);

export default menuModel;