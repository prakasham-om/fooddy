import express from "express";
import { newResturant,getResturants,getResturantbyId ,
        updateResturant,deleteResturant} from "../controllers/resturantController.js";


//import { createMenu } from "../controllers/menuController.js";        
import { protectUser } from "../controllers/userController.js";  



const resturantRouter=express.Router();


//api:   https://localhost:8080/api/resturants/
resturantRouter.route('/').post(protectUser,newResturant)
                          .get(protectUser,newResturant)
                        
//api:   https://localhost:8080/api/resturants/:resturantid
resturantRouter.route('/:id').get(protectUser,getResturantbyId)

//api:   https://localhost:8080/api/resturants/:userId/:resturantid
resturantRouter.route('/:id1/:id2').patch(protectUser,updateResturant) .delete(protectUser,deleteResturant)


export default resturantRouter;