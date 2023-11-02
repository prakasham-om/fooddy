import express from 'express'

import cors from 'cors';

import userRouter from './routes/useRouter.js'

import resturantRouter from './routes/resturantRouter.js';

import menuRouter from './routes/menuRouter.js';

import orderRouter from './routes/orderRouter.js';

import reviewRouter from './routes/reviewRouter.js';

const app = express()


app.use(express.json());

app.use(cors());

app.use('/api',userRouter);

app.use('/api/resturant',resturantRouter);


app.use('/api/menu/',menuRouter);

app.use('/api/order',orderRouter);

app.use('/api/review',reviewRouter);

export default app;