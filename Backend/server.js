import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/aouthrouts.js";
import productRoutes from "./routes/productroutes.js";
import cartRoutes from "./routes/cart.js";
import addressRoutes from "./routes/addressrouts.js";
import orderRoutes from "./routes/orderRouts.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


// Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/cart', cartRoutes)
app.use('/api/address', addressRoutes)
app.use('/api/orders', orderRoutes)



app.get('/', (req,res)=>{
    res.send('Api is running ') 
})

const startServer = async () => {
    await connectDB();

    const port = process.env.PORT || 5001;

    app.listen(port,()=>{
        console.log(`server is running at ${port}`);
    });
};

startServer();