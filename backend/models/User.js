import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema({
  userType: { type: String, enum: ['client', 'partner', 'admin','commercial'], required: true },
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, required: true },
  confirmPassword: { type: String},
  phoneNumber: { type: String, required: true },
  companyName: { type: String },
  industry: { type: String },
  position: { type: String },
  // Champs spécifiques aux clients
  servicesNeeded: { type: String },
  mainObjectives: { type: String },
  estimatedBudget: { type: Number },
  // Champs spécifiques aux partenaires
  partnershipType: { type: String },
  partnershipObjectives: { type: String },
  availableResources: { type: String }
});

export default model('User', userSchema);
