import Reunion from "../models/Reunion.js";
import nodemailer from 'nodemailer';

    export  function addOnceReunions (req, res){
        console.log('Données reçues:', req.body); // Ajouter cette ligne pour vérifier les données reçues

    Reunion.create({
              nom: req.body.nom,
              description: req.body.description,
              date: req.body.date,
              heureDebut: req.body.heureDebut,
              heureFin: req.body.heureFin,
              logiciel: req.body.logiciel,
              createur: req.body.createur,
              deuxiemeMembre: req.body.deuxiemeMembre,
              status: 'En attente', 

            })
              .then((newReunion) => {
                
                res.status(200).json({
                  nom: newReunion.nom,
                  description: newReunion.description,
                  date: newReunion.date,
                  heureDebut: newReunion.heureDebut,
                  heureFin: newReunion.heureFin,
                  logiciel: newReunion.logiciel,
                  createur: newReunion.createur,
                  deuxiemeMembre: newReunion.deuxiemeMembre,
                  status: newReunion.status,

                });
              })
              .catch((err) => {
                res.status(404).json({ error: err });
              });
    }

    export function getAllReunions(req, res) {
    Reunion
      .find({}).populate('createur')
  
      .then(docs => {
        res.status(200).json(docs);
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
    }
  
    export async function DeleteReunions(req, res) {
    const id =req.params.id
    const prd = await Reunion.findByIdAndDelete(id);
    res.status(200).json({"message":" Reunions deleted"});
    }

    export function putOnce(req, res) {
  let newReunion = {};
  if (req.file == undefined) {
    newReunion = {
        nom: req.body.nom,
        description: req.body.description,
        date: req.body.date,
        heureDebut: req.body.heureDebut,
        heureFin: req.body.heureFin,
        logiciel: req.body.logiciel,
        createur: req.body.createur,
        deuxiemeMembre: req.body.deuxiemeMembre,
    };
  } else {
    newReunion = {
        nom: req.body.nom,
        description: req.body.description,
        date: req.body.date,
        heureDebut: req.body.heureDebut,
        heureFin: req.body.heureFin,
        logiciel: req.body.logiciel,
        createur: req.body.createur,
        deuxiemeMembre: req.body.deuxiemeMembre,
    };
  }

  console.log('ID de la reunion:', req.params.id);
  console.log('Nouvelles données:', newReunion);

  Reunion.findByIdAndUpdate(req.params.id, newReunion, { new: true })
    .then((doc1) => {
      if (!doc1) {
        console.log('Reunion non trouvé');
        return res.status(404).json({ error: 'Reunion non trouvé' });
      }
      console.log('Reunion mis à jour:', doc1);
      res.status(200).json(doc1);
    })
    .catch((err) => {
      console.error('Erreur lors de la mise à jour du Reunion:', err);
      res.status(500).json({ error: err });
    });


    }


    const transporter = nodemailer.createTransport({
      host: 'ssl0.ovh.net', // Serveur SMTP d'OVH
      port: 587, // Port SMTP d'OVH
      secure: false,
      auth: {
        user: 'contact@ozisscorporation.com', // Remplacez par votre email OVH
        pass: 'O-Contact-C25', // Remplacez par le mot de passe de votre email OVH
    },
    tls: {
        // C'est une bonne pratique de définir le paramètre tls.rejectUnauthorized à false pour ignorer les erreurs de certificat SSL si elles existent.
        rejectUnauthorized: false
    }
    });
    
    const sendEmail = (to, subject, text) => {
      const mailOptions = {
        from: 'contact@ozisscorporation.com', // Votre adresse email OVH
        to,
        subject,
        text
      };
    
      return transporter.sendMail(mailOptions);
    };


    export const updateReunionStatus = async (req, res) => {
      const { id } = req.params; // Récupère l'ID de la réunion à partir des paramètres de la route
      const { status } = req.body; // Récupère le nouveau statut à partir du corps de la requête
    
      try {
        // Vérifie si le statut est valide
        const validStatuses = ['En attente', 'Confirmée', 'Refusée'];
        if (!validStatuses.includes(status)) {
          return res.status(400).json({ message: 'Statut invalide' });
        }
    
        // Trouve et met à jour le statut de la réunion
        const reu = await Reunion.findByIdAndUpdate(
          id,
          { status },
          { new: true } // Renvoie le document mis à jour
        ).populate('createur'); // Assurez-vous que 'createur' est peuplé avec les détails de l'utilisateur
    
        if (!reu) {
          return res.status(404).json({ message: 'Réunion non trouvée' });
        }
    
        let subject = 'Statut de la réunion mis à jour';
        let text = '';
    
        if (status === 'Confirmée') {
          text = `Bonjour,\n\nVotre demande de la réunion est acceptée. Un lien sera envoyé à cette adresse ultérieurement.\n\nMerci,\nL'équipe`;
        } else if (status === 'Refusée') {
          text = `Bonjour,\n\nDésolé, votre demande de la réunion est refusée. Veuillez essayer avec une autre date ou une autre heure.\n\nMerci,\nL'équipe`;
        }
    
        // Envoie un email au créateur de la réunion
        const email = reu.createur.email; // Récupère l'email du créateur
        await sendEmail(email, subject, text);
    
        res.status(200).json(reu);
      } catch (error) {
        res.status(500).json({ message: 'Erreur du serveur', error });
      }
    };