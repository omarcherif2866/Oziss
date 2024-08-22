import mongoose from 'mongoose';
const { Schema, model } = mongoose;


const ReunionSchema = new Schema(
    {
        nom: {
            type: String,
        },
        description: {
            type: String,
        },
        date: {
            type: String,
        },
        
        heureDebut: {
            type: String,
        },
        
        heureFin: {
            type: String,
        },
        logiciel: {
            type: String,
        },
        createur: { type: Schema.Types.ObjectId, ref: 'User',},
        deuxiemeMembre: {             
            type: String,
        },
        status: { type: String, enum: ['En attente', 'Confirmée', 'Refusée'], default: 'En attente' },


    },
    {
        timestamps: true
    }
);

export default model('Reunion', ReunionSchema);
