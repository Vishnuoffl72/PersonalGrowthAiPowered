import express from "express";
import 'dotenv/config';
import { connectDb } from "./config/db.js";
import cors from "cors";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import 'dotenv/config';
import authRouter from './routes/auth.js'
import habitRouter from './routes/habits.js'

const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/health", (req, res)=>{
    res.json({status: "ok",time: new Date().toISOString()});
})

app.use('/api/auth',authRouter)
app.use('/api/habits',habitRouter)

app.use(notFound);
app.use(errorHandler);

connectDb().then(()=>{
    app.listen(process.env.PORT, ()=>{
        console.log(`Server listening inn port ${process.env.PORT}`);
    })
})


