import mongoose from "mongoose";

export const connectDb = async () =>{
    try {
        console.log(process.env.MONGO_URI)
        const dbConnection = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Database connected ${dbConnection.connection.host}`);
    } catch (err) {
        console.error("Db connection error", err.message);
        process.exit(1);
    }
}