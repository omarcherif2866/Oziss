import express from 'express';
import { body } from "express-validator";
import multer from "../middlewares/multer-config.js";
import { DeleteProduits, addOnceProduits, countProducts, getAllProduct, getProductsByService, getProduitsById, getTopSellingProducts, putOnce } from '../controllers/Produit.js';


const router = express.Router();


router.route('/')
.get(getAllProduct);

router.route('/count')
.get(countProducts);

router.get('/products-by-service', getProductsByService);

router.get('/top-selling-products', getTopSellingProducts);


router.route('/')
.post(
    multer("image"),
    addOnceProduits);


router.route('/:id')
.get(getProduitsById)
.delete(DeleteProduits)
.put(
    multer("image"),
    putOnce)



export default router;

