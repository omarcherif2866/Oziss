import express from 'express';
import { addOnceProjet, DeleteProjet, getAllProjets, getProjetsByCriteria, putOnce, updateProjetStatus } from '../controllers/projet.js';
import upload from '../middlewares/multerPdf.js';


const router = express.Router();


router.route('/')
.get(getAllProjets);




router.post('/addProjet/:ownedBy', upload.array('pdf', 10), addOnceProjet);



router.route('/:id')
.delete(DeleteProjet)
.put(
    upload.array('pdf',10),
    putOnce)

router.put('/status/:id', updateProjetStatus);

router.get('/filter', getProjetsByCriteria); // Route pour récupérer les projets par critères


export default router;

