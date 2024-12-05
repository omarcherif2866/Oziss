import mongoose from 'mongoose';
const { Schema, model } = mongoose;


const ImageBanniereSchema = new Schema(
    {
        image: {
            type: String,
            required: true,
        },
        titre: {
            type: String,
            required: true
        },
        sousTitre: {
            type: String,
            required: true
        },

    },
    {
        timestamps: true
    }
);

export default model('ImageBanniere', ImageBanniereSchema);
