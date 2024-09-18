import Projet from "../models/projet.js";

    export  function addOnceProjet (req, res){
        console.log('Données reçues:', req.body); // Ajouter cette ligne pour vérifier les données reçues
        const pdfNames = req.files.map(file => file.filename); // Récupère seulement les noms des fichiers
        const ownedBy = req.params.ownedBy; // Récupère l'ID de ownedBy à partir des paramètres de la route

    Projet.create({
              nom: req.body.nom,
              description: req.body.description,
              dateDebut: req.body.dateDebut,
              ownedBy: ownedBy,
              with: req.body.with,
              pdf: pdfNames,
              status: 'En attente', 

            })
              .then((newProjet) => {
                
                res.status(200).json({
                  nom: newProjet.nom,
                  description: newProjet.description,
                  ownedBy: newProjet.ownedBy,
                  dateDebut: newProjet.dateDebut,
                  with: newProjet.with,

                  pdf:newProjet.pdf,
                  status: newProjet.status,

                });
              })
              .catch((err) => {
                res.status(404).json({ error: err });
              });
    }

    export function getAllProjets(req, res) {
    Projet
      .find({}).populate('with')
  
      .then(docs => {
        res.status(200).json(docs);
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
    }
  
    export async function DeleteProjet(req, res) {
    const id =req.params.id
    const prd = await Projet.findByIdAndDelete(id);
    res.status(200).json({"message":" Projets deleted"});
    }

    export function putOnce(req, res) {
      // Préparer les données pour la mise à jour
      let newProjet = {
        nom: req.body.nom,
        description: req.body.description,
        dateDebut: req.body.dateDebut,
        pdf: req.files ? req.files.map(file => file.path) : []
      };
    
      // Log des données reçues
      console.log('ID de la Projet:', req.params.id);
      console.log('Nouvelles données:', newProjet);
      console.log('Body:', req.body);
      console.log('Files:', req.files);
      
      // Mise à jour du projet dans la base de données
      Projet.findByIdAndUpdate(req.params.id, newProjet, { new: true })
        .then((doc1) => {
          if (!doc1) {
            console.log('Projet non trouvé');
            return res.status(404).json({ error: 'Projet non trouvé' });
          }
          console.log('Projet mis à jour:', doc1);
          res.status(200).json(doc1);
        })
        .catch((err) => {
          console.error('Erreur lors de la mise à jour du Projet:', err);
          res.status(500).json({ error: err.message });
        });
    }
    



    export const updateProjetStatus = async (req, res) => {
        const { id } = req.params; 
        const { status } = req.body; 
      
        try {
          const validStatuses = ['En attente', 'Terminé', 'En cours'];
          if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Statut invalide' });
          }
      
          const prj = await Projet.findByIdAndUpdate(
            id,
            { status },
            { new: true } 
          )
      
          if (!prj) {
            return res.status(404).json({ message: 'projet non trouvée' });
          }
      
          res.status(200).json(prj);
        } catch (error) {
          res.status(500).json({ message: 'Erreur du serveur', error });
        }
      };

      export function getProjetsByCriteria(req, res) {
        const { ownedBy, with: withUser } = req.query;
      
        // Assurez-vous que les valeurs sont définies
        if (!ownedBy && !withUser) {
          return res.status(400).json({ message: 'Les critères de recherche ne sont pas définis.' });
        }
      
        // Requête avec condition logique OR
        Projet.find({
          $or: [
            { ownedBy: ownedBy },
            { with: withUser }
          ]
        })
        .populate('ownedBy').populate('with')
          .then(docs => {
            res.status(200).json(docs);
          })
          .catch(err => {
            res.status(500).json({ error: err });
          });
      }