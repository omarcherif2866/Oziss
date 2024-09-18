import { Component } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../service/user.service';
import { Message, MessageService } from 'primeng/api';

@Component({
  providers: [MessageService],
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss'
})
export class ProfilComponent {
  uploadedFiles: File[] = [];
  form: any = {}; // Déclarer form comme un objet vide
  user!: User; // Variable pour stocker les données de l'utilisateur
  userId: string | null = null;
  messages: Message[] = []; // Propriété pour stocker les messages à afficher
  constructor(private userService: UserService,  private messageService: MessageService  ) {}

  ngOnInit(): void {
    this.userId = this.getUserId();
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.userService.getUserProfile(userId).subscribe(
        (response) => {
          this.user = response;
          // Remplir le formulaire avec les données de l'utilisateur
          this.fillFormWithUserData();
        },
        (error) => {
          console.error('Erreur lors de la récupération des données utilisateur :', error);
        }
      );
    } else {
      console.error('Aucun userId trouvé dans le localStorage.');
    }
    
    
  }

  fillFormWithUserData(): void {
    if (this.user) {
      // Remplir les champs généraux
      this.form.nom = this.user.nom;
      this.form.email = this.user.email;
      this.form.phoneNumber = this.user.phoneNumber;
      this.form.image = this.user.image
      // Remplir les champs spécifiques aux clients
      if (this.getUserRole() === 'client') {
        this.form.servicesNeeded = this.user.servicesNeeded;
        this.form.mainObjectives = this.user.mainObjectives;
        this.form.estimatedBudget = this.user.estimatedBudget;
      }
  
      // Remplir les champs spécifiques aux partenaires
      if (this.getUserRole() === 'partner') {
        this.form.partnershipType = this.user.partnershipType;
        this.form.partnershipObjectives = this.user.partnershipObjectives;
        this.form.availableResources = this.user.availableResources;
      }
    }
  }
  

  getUserId(): string | null {
    return localStorage.getItem('user_id');
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  onFileSelected(event: any): void {
    if (event.files && event.files.length > 0) {
      this.uploadedFiles = [];
      for (let file of event.files) {
        this.uploadedFiles.push(file);
      }
    } else {
      console.error("Erreur lors de la sélection du fichier : la propriété 'files' n'est pas définie dans l'événement.");
    }
  }

  onSubmit(): void {
    if (this.userId && this.user) {
      const formData = new FormData();
      formData.append('prenom', this.form.prenom);
      formData.append('nom', this.form.nom);
      formData.append('username', this.form.username);
      formData.append('email', this.form.email);
      formData.append('tel', this.form.tel);

      // Ajoutez d'autres champs spécifiques selon le rôle de l'utilisateur
      if (this.getUserRole() === 'client') {
        formData.append('servicesNeeded', this.form.servicesNeeded);
        formData.append('mainObjectives', this.form.mainObjectives);
        formData.append('estimatedBudget', this.form.estimatedBudget);
      }
      if (this.getUserRole() === 'partner') {
        formData.append('partnershipType', this.form.partnershipType);
        formData.append('partnershipObjectives', this.form.partnershipObjectives);
        formData.append('availableResources', this.form.availableResources);
      }

      // Ajoutez le fichier image s'il a été sélectionné
      if (this.uploadedFiles.length > 0) {
        formData.append('image', this.uploadedFiles[0]); // Vous pouvez adapter cela si plusieurs fichiers sont gérés
      }

      // Appelez le service pour mettre à jour le profil utilisateur
      this.userService.updateUserProfile(this.userId, formData).subscribe(
        (updatedUser: User) => {
          console.log('Profil utilisateur mis à jour avec succès : ', updatedUser);
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Profil utilisateur mis à jour avec succès', life: 3000 });
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du profil utilisateur : ', error);
          // Gérez les erreurs
        }
      );
    }
  }

  getImageUrl(imageName: string): string {
    return `http://localhost:9090/img/${imageName}`;
  }
}
