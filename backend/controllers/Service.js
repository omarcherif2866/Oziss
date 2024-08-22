import Service from "../models/Service.js";



export  function addOnceServices (req, res){
    Service.create({
              nom: req.body.nom,
              description: req.body.description,
              image: `${req.file.filename}`,
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
        res.status(200).json(docs);
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
              res.status(200).json(doc);
            })
            .catch((err) => {
              res.status(500).json({ error: err });
            });
        }
  
  
  export function putOnce(req, res) {
    let newServices = {};
      if(req.file == undefined) {
        newServices = {
              nom: req.body.nom,
              description: req.body.description,
              image: `${req.file.filename}`,
              description: req.body.description,

                  }
      }
      else {
        newServices = {
              nom: req.body.nom,
              description: req.body.description,
              image: `${req.file.filename}`,
              description: req.body.description,

                  }
      }
      Service.findByIdAndUpdate(req.params.id, newServices)
      .then((doc1) => {
        Service.findById(req.params.id)
          .then((doc2) => {
              res.status(200).json(doc2);
                })
          .catch((err) => {
              res.status(500).json({ error: err });
                });
            })
        .catch((err) => {
              res.status(500).json({ error: err });
            });
        }
  
  
  