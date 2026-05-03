import express from "express";
import { loginAdmin, createAdmin } from "../Controller/adminController.js";

import {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,

} from "../Controller/productController.js";

import { verifyAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/login", loginAdmin);


// ⚠️ USE ONLY ONCE THEN DELETE
router.post("/create-admin", createAdmin);

// router to create new product
router.post('/add', verifyAdmin, createProduct);

// router to get all product
router.get('/',verifyAdmin, getAllProducts); 

// router to update product
router.put('/update/:id', verifyAdmin, updateProduct);

// router to delete product
router.delete('/delete/:id', verifyAdmin, deleteProduct);




export default router;