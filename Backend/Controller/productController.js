import Product from "../model/product.js";



//create new product
export const createProduct = async (req, res) => {
    try {
        const {
            title,
            description,
            price,
            category,
            catogory,
            image,
            stock
        } = req.body;

        if (!title || price === undefined || price === null || price === "") {
            return res.status(400).json({ message: "title and price are required" });
        }

        const parsedPrice = Number(price);
        if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
            return res.status(400).json({ message: "price must be a valid non-negative number" });
        }

        const parsedStock = stock === undefined || stock === null || stock === "" ? 0 : Number(stock);
        if (Number.isNaN(parsedStock) || parsedStock < 0) {
            return res.status(400).json({ message: "stock must be a valid non-negative number" });
        }

       
        const createdProduct = await Product.create({
            title,
            description,
            price: parsedPrice,
            category: category ?? catogory,
            image,
            stock: parsedStock
        });
        res.status(201).json({ message: "Product created successfully", product: createdProduct });

        
    }catch (error) {
        res.status(500).json({
            message: error.message || "Server error",
            error: error.message
        })
    }

}

//get all product 

export const getAllProducts = async (req, res) => {
    try {
        const {search, category} = req.query;

        let filter = {};

        if (search) {
            filter.title = { $regex: search, $options: 'i' }; // Case-insensitive search
        }

        if (category) {
            filter.category = category;
        }

        const products = await Product.find(filter).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

export const getProducts = getAllProducts;

//updated product

export const updateProduct = async (req, res) => {
    try {
        const update = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true });
            res.json({ message: "Product updated successfully", update });
        
    } catch (error) {
        res.status(500).json({message: "Server error", error})
        
    }

}


//delete product
export const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted successfully" });    
    } catch (error) {
        res.status(500).json({message: "Server error", error})  
    }
}