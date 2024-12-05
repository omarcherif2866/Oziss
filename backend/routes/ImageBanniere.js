import express from 'express';
import multer from "../middlewares/multer-config.js";
import { addOnceImageBanniere, DeleteImages, getAllImage } from '../controllers/ImageBanniere.js';


const router = express.Router();

router.route('/')
.post(
    multer("image"),
    addOnceImageBanniere);

router.route('/')
.get(getAllImage);

router.route('/:id')
.delete(DeleteImages)

export default router;
