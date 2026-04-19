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
let dbConnectPromise;

const ensureDbConnected = () => {
    if (!dbConnectPromise) {
        dbConnectPromise = connectDB();
    }

    return dbConnectPromise;
};

app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
    try {
        await ensureDbConnected();
        next();
    } catch (error) {
        res.status(500).json({ message: "Database connection failed", error: error.message });
    }
});


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
    await ensureDbConnected();

    const port = process.env.PORT || 5001;

    app.listen(port,()=>{
        console.log(`server is running at ${port}`);
    });
};

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    startServer();
}

export default app;