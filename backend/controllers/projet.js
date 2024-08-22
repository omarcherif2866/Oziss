import Projet from "../models/projet.js";

    export  function addOnceProjet (req, res){
        console.log('Données reçues:', req.body); // Ajouter cette ligne pour vérifier les données reçues
        const pdfNames = req.files.map(file => file.filename); // Récupère seulement les noms des fichiers

    Projet.create({
              nom: req.body.nom,
              description: req.body.description,
              dateDebut: req.body.dateDebut,
              ownedBy: req.body.ownedBy,
              with: req.body.with,
              pdf: pdfNames,
              status: 'En attente', 

            })
              .then((newProjet) => {
                
                res.status(200).json({
                  nom: newProjet.nom,
                  description: newProjet.description,
                  // ownedBy: newProjet.ownedBy,
                  dateDebut: newProjet.dateDebut,
                  // with: newProjet.with,

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
      .find({})
  
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
  let newProjet = {};
  if (req.file == undefined) {
    newProjet = {
        nom: req.body.nom,
        description: req.body.description,
        dateDebut: req.body.dateDebut,
    };
  } else {
    newProjet = {
        nom: req.body.nom,
        description: req.body.description,
        dateDebut: req.body.dateDebut,

    };
  }

  console.log('ID de la Projet:', req.params.id);
  console.log('Nouvelles données:', newProjet);

  Projet.findByIdAndUpdateDebut(req.params.id, newProjet, { new: true })
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
      res.status(500).json({ error: err });
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