import {createMenu,getAllMenu, getMenuById, getMenuByResturant, updateMenu} from "../controllers/menuController.js"
import { protectUser } from "../controllers/userController.js";
import express from 'express';


const menuRouter=express.Router();


//api : http://localhost:8000/api/menu/:resturantId 
menuRouter.route('/:id1/:id2').post(protectUser,createMenu).get(protectUser,getMenuByResturant)


//api :http://localhost:8000/api/menu/:userId/:menuId
menuRouter.route('/:id1/:id2').get(protectUser,getMenuById).patch(protectUser,updateMenu)


//api : http://localhost:8000/api/menu/:resturantId
menuRouter.route('/:id').get(protectUser,getMenuByResturant) //menu get by resturantId for public


//api : http://localhost:8000/api/menu/getallmenu
menuRouter.route('/getallmenu').get(protectUser,getAllMenu)  //for public access



export default menuRouter;