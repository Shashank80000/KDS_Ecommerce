import Admin from "../model/admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ LOGIN
export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
        return res.status(400).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
        { id: admin._id, role: "admin" },
        process.env.JWT_ADMIN_SECRET,
        { expiresIn: "1d" }
    );

    res.json({ token });
};

// ⚠️ TEMPORARY (create admin once)
export const createAdmin = async (req, res) => {
    const hashedPassword = await bcrypt.hash("123456", 10);

    const admin = new Admin({
        email: "admin@gmail.com",
        password: hashedPassword,
    });

    await admin.save();
    res.json({ message: "Admin created" });
};