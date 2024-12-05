import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const temoignageSchema = new Schema({
  text: { type: String, required: true },
  createur: { type: Schema.Types.ObjectId, ref: 'User',},

  
});

export default model('Temoignage', temoignageSchema);
