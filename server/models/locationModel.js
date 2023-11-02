import mongoose from 'mongoose';

const locationSchema=new mongoose.Schema({
    city:   {
        type:String,
        required:true,
    },
    coordinates:{
        latitude:Number,
        longitude:Number,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }
})


const locationModel=mongoose.model('Location',locationSchema);

export default locationModel;