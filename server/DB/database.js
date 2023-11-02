import mongoose from 'mongoose'
import dotenv from 'dotenv';
dotenv.config();

const url=process.env.DB_URL

const dataBaseConnection=()=>{

mongoose.connect(url,{
    useNewUrlParser:true,
    //useUnifiedTopology:true
}).then(()=>{
    console.log("db connected successfully")
}).catch(err=>console.log(err))

}

export default dataBaseConnection;