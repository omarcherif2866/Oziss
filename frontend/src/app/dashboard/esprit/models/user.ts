export class User {
  _id?: string;
  userType?: 'client' | 'partner' | 'admin'| 'commercial';
  nom?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phoneNumber?: string;
  companyName?: string;
  industry?: string;
  position?: string;
  image?: string;
  // Champs spécifiques aux clients
  servicesNeeded?: string;
  mainObjectives?: string;
  estimatedBudget?: number;
  // Champs spécifiques aux partenaires
  partnershipType?: string;
  partnershipObjectives?: string;
  availableResources?: string;
  }
  