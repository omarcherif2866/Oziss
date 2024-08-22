import express from 'express';
import { addOnceProjet, DeleteProjet, getAllProjets, putOnce, updateProjetStatus } from '../controllers/projet.js';
import upload from '../middlewares/multerPdf.js';


const router = express.Router();


router.route('/')
.get(getAllProjets);




router.post('/addProjet', upload.array('pdf', 10), addOnceProjet);



router.route('/:id')
.delete(DeleteProjet)
.put(
    putOnce)

router.put('/status/:id', updateProjetStatus);


export default router;

