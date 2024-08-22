// import express from 'express';
// import { DeleteFormateurs, addOnceFormateurs, countAllFormateurs, countFormateurPerDate, getAll, getFormateursById, putOnce } from '../controllers/Formateur.js';


// const router = express.Router();


// router.route('/')
// .get(getAll);

// router.route('/')
// .post(
//     addOnceFormateurs);


// router.route('/:id')
// .get(getFormateursById)
// .delete(DeleteFormateurs)
// .put(
//     putOnce)

// router.route('/count')
// .get(countAllFormateurs)

// router.route('/countFormateurPerDate/:year')
// .get(countFormateurPerDate)



// export default router;

import express from 'express';
import multer from "../middlewares/multer-config.js";

import {
  DeleteFormateurs,
  addOnceFormateurs,
  addPdfToFormateur,
  // addOncefichiersFormateurs,
  countAllFormateurs,
  countFormateurPerDate,
  getAll,
  getFormateursById,
  putOnce,
  sendContentByEmail,
  signupFormateur
} from '../controllers/Formateur.js';
import upload from '../middlewares/multerPdf.js';

const router = express.Router();

router.route('/')
  .get(getAll)
  .post(addOnceFormateurs);


  router.route('/signup')
  .post(
      multer("image"),
      signupFormateur)
      
router.route('/count')
  .get(countAllFormateurs);

  router.route('contenu/:formateurId')
  .put(
    addPdfToFormateur)

  // router.post('/send_email/:id', 
  // upload.single('file'), 
  // sendContentByEmail);



router.route('/:id')
  .get(getFormateursById)
  .delete(DeleteFormateurs)
  .put(putOnce);



router.route('/countFormateurPerDate/:year')
  .get(countFormateurPerDate);

export default router;
