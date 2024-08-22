import Produit from "../models/Produit.js";
import Order from "../models/Order.js";


export  function addOnceProduits (req, res){
    Produit.create({
              nom: req.body.nom,
              description: req.body.description,
              image: `${req.file.filename}`,
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
        res.status(200).json(docs);
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  }
  
  export async function DeleteProduits(req, res) {
    const id =req.params.id
    const prd = await Produit.findByIdAndDelete(id);
    res.status(200).json({"message":" Produits deleted"});
  }
  
  export function getProduitsById(req, res){
    Produit.findById(req.params.id)
            .then((doc) => {
              res.status(200).json(doc);
            })
            .catch((err) => {
              res.status(500).json({ error: err });
            });
        }
  
  
export function putOnce(req, res) {
  let newProduits = {};
  if (req.file == undefined) {
    newProduits = {
      nom: req.body.nom,
      description: req.body.description,
      service: req.body.service
    };
  } else {
    newProduits = {
      nom: req.body.nom,
      description: req.body.description,
      image: `${req.file.filename}`,
      service: req.body.service
    };
  }

  console.log('ID du produit:', req.params.id);
  console.log('Nouvelles données:', newProduits);

  Produit.findByIdAndUpdate(req.params.id, newProduits, { new: true })
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

  
  
  