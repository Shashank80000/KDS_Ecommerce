import express from "express";
import {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,

} from "../Controller/productController.js";

const router = express.Router();

// router to create new product
router.post('/add', createProduct);

// router to get all product
router.post('/', getAllProducts); 

// router to update product
router.put('/update/:id', updateProduct);

// router to delete product
router.delete('/delete/:id', deleteProduct);

export default router;
