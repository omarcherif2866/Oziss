import ImageBanniere from "../models/ImageBanniere.js";
import { v2 as cloudinary } from 'cloudinary'; // Assurez-vous que c'est bien importé

export  function addOnceImageBanniere (req, res){
  const imageFile = req.file;
  if (!imageFile) {
    return res.status(400).json({ message: 'Please upload an image' });
  }
    ImageBanniere.create({

      image: imageFile.path, // Stocke l'URL de Cloudinary
      titre:req.body.titre,
      sousTitre:req.body.sousTitre,

  
            })
              .then((newImageBanniere) => {
                
                res.status(200).json({
  
                });
              })
              .catch((err) => {
                res.status(404).json({ error: err });
              });
          }

  export function getAllImage(req, res) {
    ImageBanniere
      .find({})
  
      .then(docs => {
        // Mapper les documents pour ajouter l'URL de l'image
        const imageBannerWithImages = docs.map(doc => {
          if (doc.image) {
            // Construire l'URL complète pour l'image
            doc.image = cloudinary.url(doc.image); // Utiliser uniquement le nom de fichier
          }
          return doc; // Retourner le document modifié
        });
    
        res.status(200).json(imageBannerWithImages);
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
    }
  
  export async function DeleteImages(req, res) {
    const id =req.params.id
    const prd = await ImageBanniere.findByIdAndDelete(id);
    res.status(200).json({"message":" ImageBanniere deleted"});
  }