import express from 'express';
import { addOnceReunions, DeleteReunions, getAllReunions, putOnce, updateReunionStatus } from '../controllers/Reunion.js';


const router = express.Router();


router.route('/')
.get(getAllReunions);




router.route('/addReunion')
.post(
    addOnceReunions);


router.route('/:id')
.delete(DeleteReunions)
.put(
    putOnce)

router.put('/status/:id', updateReunionStatus);


export default router;

