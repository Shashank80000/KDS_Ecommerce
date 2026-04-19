import express from "express";

import {saveAddress, getAddresses} from "../Controller/addressController.js";


const router = express.Router();

router.post('/add', saveAddress);
router.get('/:userId', getAddresses);

export default router;
