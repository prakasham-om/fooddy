import mongoose from 'mongoose';


const resturantSchema=mongoose.Schema({
   
    name:{
        type:String,
        required:true,
    },
    address:[
        {
            street:String,
            city:String,
            state:String,
            zip:String
        }
    ],
    cuisine:{
        type:String,
        required:true,
    },
   ownerId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
   },
   
})



const resturantModel=mongoose.model('Resturant',resturantSchema);

export default resturantModel;