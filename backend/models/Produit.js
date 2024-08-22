import mongoose from 'mongoose';
const { Schema, model } = mongoose;


const ProduitSchema = new Schema(
    {
        nom: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true,
        },
        service: { type: Schema.Types.ObjectId, ref: 'Service', required: true }

    },
    {
        timestamps: true
    }
);

export default model('Produit', ProduitSchema);
