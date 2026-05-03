import express from "express";
import { getAllProducts } from "../Controller/productController.js";
const router = express.Router();


// router to get all product
router.get('/', getAllProducts); 


export default router;
