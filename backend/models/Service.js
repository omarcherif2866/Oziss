import mongoose from 'mongoose';
const { Schema, model } = mongoose;


const ServiceSchema = new Schema(
    {
        nom: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        subDesc: [{
            type: String,
            required: true
        }],
        image: {
            type: String,
            required: true,
          }
    },
    {
        timestamps: true
    }
);

export default model('Service', ServiceSchema);
