import express from 'express';
import { body } from "express-validator";
import multer from "../middlewares/multer-config.js";
import { DeleteServices, addOnceServices, countServices, getAll, getServicesById, putOnce } from '../controllers/Service.js';


const router = express.Router();


router.route('/')
.get(getAll);

router.route('/count')
.get(countServices);

router.route('/')
.post(
    multer("image"),
    addOnceServices);


router.route('/:id')
.get(getServicesById)
.delete(DeleteServices)
.put(
    multer("image"),
    putOnce)



export default router;

