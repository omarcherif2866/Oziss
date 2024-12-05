import Service from "../models/Service.js";



export  function addOnceServices (req, res){
        // Vérification de l'image de service
        const imageFile = req.file;
        if (!imageFile) {
          return res.status(400).json({ message: 'Please upload an image' });
        }
    Service.create({
              nom: req.body.nom,
              description: req.body.description,
              image: imageFile.path,
              subDesc: req.body.subDesc,

  
            })
              .then((newServices) => {
                
                res.status(200).json({
                  nom: newServices.nom,
                  description: newServices.description,
                  subDesc: newServices.subDesc,
  
  
                });
              })
              .catch((err) => {
                res.status(404).json({ error: err });
              });
          }
        
    
  
  
  export function getAll(req, res) {
    Service
      .find({})
  
      .then(docs => {
        // Map pour ajouter l'URL complète pour chaque image
        const servicesWithImageUrls = docs.map(doc => {
          if (doc.image) {
            // Vérifie si l'image est stockée sur Cloudinary ou localement
            if (doc.image.startsWith('http')) {
              // Si l'image est déjà une URL (Cloudinary)
              doc.image = doc.image; // Utilise directement l'URL
            } else {
              // Sinon, on construit l'URL pour l'image stockée localement
              doc.image = `http://localhost:9090/img/${doc.image}`; // Remplacez le port et le chemin selon votre configuration
            }
          }
          return doc;
        });
  
        res.status(200).json(servicesWithImageUrls);
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  }
  
  export async function DeleteServices(req, res) {
    const id =req.params.id
    const ss = await Service.findByIdAndDelete(id);
    res.status(200).json({"message":" Services deleted"});
  }
  
  export function getServicesById(req, res){
    Service.findById(req.params.id)
    .then((doc) => {
      if (!doc) {
        return res.status(404).json({ message: "service non trouvé" });
      }

      // Vérification et mise à jour de l'URL de l'image
      if (doc.image) {
        if (doc.image.startsWith('http')) {
          // L'image est déjà une URL complète (par exemple, Cloudinary)
          doc.image = doc.image;
        } else {
          // L'image est stockée localement, on construit l'URL complète
          doc.image = `http://localhost:9090/img/${doc.image}`; // Ajustez le port et le chemin selon votre configuration
        }
      }

      res.status(200).json(doc);
    })
    .catch((err) => {
      console.error("Erreur lors de la récupération du service :", err);
      res.status(500).json({ error: err });
    });
        }
  
        export function putOnce(req, res) {
          const imageFile = req.file;
        
          // On commence par définir les données de l'actualité, sans inclure l'image pour l'instant
          let newServices = {
            nom: req.body.nom,
            description: req.body.description,
          };
        
          if (req.body.subDesc) {
            newServices.subDesc = req.body.subDesc; // Ajoute le champ subDesc uniquement si défini
          }
          
          // Si un fichier image a été envoyé, on met à jour l'image
          if (imageFile) {
            newServices.image = imageFile.path;
          }
        
          console.log('ID du service:', req.params.id);
          console.log('Nouvelles données:', newServices);
        
          // Mise à jour de l'actualité dans la base de données
          Service.findByIdAndUpdate(req.params.id, newServices, { new: true })
            .then((doc1) => {
              if (!doc1) {
                console.log('service non trouvée');
                return res.status(404).json({ error: 'service non trouvée' });
              }
              console.log('service mise à jour:', doc1);
              res.status(200).json(doc1);
            })
            .catch((err) => {
              console.error('Erreur lors de la mise à jour du service:', err);
              res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'Actualité' });
            });
        }  


export async function countServices (req, res){
  try {
    const serviceCount = await Service.countDocuments({});
    res.json({ serviceCount });
  } catch (error) {
    console.error('Error counting services:', error);
    res.status(500).json({ message: 'Error counting services' });
  }
};
  
  
  