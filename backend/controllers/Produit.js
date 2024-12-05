import Produit from "../models/Produit.js";
import Order from "../models/Order.js";
import cloudinary from 'cloudinary';


export  function addOnceProduits (req, res){
      // Vérification de l'image de profil
      const imageFile = req.file;
      if (!imageFile) {
        return res.status(400).json({ message: 'Please upload an image' });
      }
    Produit.create({
              nom: req.body.nom,
              description: req.body.description,
              image: imageFile.path,
              service: req.body.service
  
            })
              .then((newProduits) => {
                
                res.status(200).json({
                  nom: newProduits.nom,
                  description: newProduits.description,
                  service: newProduits.service

  
                });
              })
              .catch((err) => {
                res.status(404).json({ error: err });
              });
          }
        
    
  
  
          export function getAllProduct(req, res) {
            Produit
              .find({})
              .then(docs => {
                // Map pour ajouter l'URL complète pour chaque image
                const productsWithImageUrls = docs.map(doc => {
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
          
                res.status(200).json(productsWithImageUrls);
              })
              .catch(err => {
                res.status(500).json({ error: err });
              });
          }
  
export async function DeleteProduits(req, res) {
  const id = req.params.id;
  console.log("ID du produit à supprimer :", id);  // Vérifiez que l'ID est correct
  try {
    const prd = await Produit.findByIdAndDelete(id);
    if (!prd) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }
    res.status(200).json({ message: "Produit supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du produit :", error);
    res.status(500).json({ error: "Erreur de suppression du produit" });
  }
}

  
  export function getProduitsById(req, res) {
    Produit.findById(req.params.id)
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({ message: "Produit non trouvé" });
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
        console.error("Erreur lors de la récupération du produit :", err);
        res.status(500).json({ error: err });
      });
  }
  
  
  export function putOnce(req, res) {
    let newProduits = {};
  
    // Vérification si l'image est présente dans la requête
    if (req.file == undefined) {
      newProduits = {
        nom: req.body.nom,
        description: req.body.description,
      };
    } else {
      newProduits = {
        nom: req.body.nom,
        description: req.body.description,
        image: `${req.file.filename}`,
      };
    }
  
    // Vérification de la valeur du service
    if (req.body.service && req.body.service !== "Aucun") {
      newProduits.service = req.body.service;  // Ajouter le service seulement s'il est défini et différent de "Aucun"
    } 
  
  
    const updateData = newProduits;
  
    if (!newProduits.service) {
      updateData['$unset'] = { service: 1 };  // Spécifie que le champ `service` doit être supprimé
    }
  
    console.log('ID du produit:', req.params.id);
    console.log('Données envoyées à la base de données:', updateData);
  
    // Mise à jour du produit dans la base de données
    Produit.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .then((doc1) => {
        if (!doc1) {
          console.log('Produit non trouvé');
          return res.status(404).json({ error: 'Produit non trouvé' });
        }
        console.log('Produit mis à jour:', doc1);
        res.status(200).json(doc1);
      })
      .catch((err) => {
        console.error('Erreur lors de la mise à jour du produit:', err);
        res.status(500).json({ error: err });
      });
  }
  

export async function countProducts (req, res){
  try {
    const productCount = await Produit.countDocuments({});
    res.json({ productCount });
  } catch (error) {
    console.error('Error counting products:', error);
    res.status(500).json({ message: 'Error counting products' });
  }
};

export const getProductsByService = async (req, res) => {
  try {
    // Trouver tous les produits en peuplé avec les données du service
    const produits = await Produit.aggregate([
      {
        $lookup: {
          from: 'services', // Assurez-vous que le nom de la collection est correct
          localField: 'service',
          foreignField: '_id',
          as: 'serviceDetails'
        }
      },
      {
        $unwind: '$serviceDetails'
      },
      {
        $group: {
          _id: '$serviceDetails.nom', // Group by service name
          products: { $push: { nom: '$nom', description: '$description', image: '$image' } }
        }
      }
    ]);

    res.json(produits);
  } catch (error) {
    console.error('Error fetching products by service:', error);
    res.status(500).json({ message: 'Error fetching products by service' });
  }
};

export const getTopSellingProducts = async (req, res) => {
  try {
    // Agrégation pour compter le nombre de fois que chaque produit a été commandé
    const topSellingProducts = await Order.aggregate([
      { $unwind: '$produits' }, // Décomposer les produits dans chaque commande
      { $group: { 
        _id: '$produits.produit', // Grouper par ID de produit
        count: { $sum: 1 } // Compter le nombre d'occurrences
      }},
      { $sort: { count: -1 } }, // Trier par nombre d'occurrences (plus vendu en premier)
      { $limit: 10 }, // Limiter les résultats aux 10 produits les plus vendus
      { $lookup: {
        from: 'produits', // Nom de la collection de produits
        localField: '_id',
        foreignField: '_id',
        as: 'produitDetails'
      }},
      { $unwind: '$produitDetails' } // Décomposer les détails du produit
    ]);

    res.json(topSellingProducts);
  } catch (error) {
    console.error('Error fetching top selling products:', error);
    res.status(500).json({ message: 'Error fetching top selling products' });
  }
};

  
  
  