import mongoose from 'mongoose';
const { Schema, model } = mongoose;


const ProjetSchema = new Schema(
    {
        nom: {
            type: String,
        },
        description: {
            type: String,
        },
        dateDebut: {
            type: String,
        },
        pdf: [{ type: String }],
        status: { type: String, enum: ['En attente', 'Terminé', 'En cours'], default: 'En attente' },
        ownedBy: { 
            type: mongoose.Types.ObjectId, 
            ref: 'User' 
          },
          with: { 
            type: mongoose.Types.ObjectId, 
            ref: 'User' 
          },

    },
    {
        timestamps: true
    }
);

export default model('Projet', ProjetSchema);
