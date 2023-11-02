import express from 'express';

import {reviewCreate} from '../controllers/reviewController.js'

const reviewRouter=express.Router();

//api : http://localhost:8000/api/review/:menuId

reviewRouter.post('/:id',reviewCreate)


export default reviewRouter