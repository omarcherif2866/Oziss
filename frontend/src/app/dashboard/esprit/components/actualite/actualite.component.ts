import { Component } from '@angular/core';
import { Actualite } from '../../models/actualite';
import { ActualiteService } from '../../service/actualite.service';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-actualite',
  templateUrl: './actualite.component.html',
  styleUrl: './actualite.component.scss'
})
export class ActualiteComponent {
  displayModal: boolean = false;
  selectedDescription: string = '';
  actualiteDialog: boolean = false;
  actionLabel: string = 'Enregistrer';
  deleteActualiteDialog: boolean = false;
  actualites: Actualite[] = [];
  actualite: Actualite = {
    _id: '',
  };
  selectedActualites: Actualite[] = [];
  actualiteImageUrl!: string; 

  submitted: boolean = false;
  uploadedFiles: File[] = [];

  cols: any[] = [];
  rowsPerPageOptions = [5, 10, 20];


  constructor(
    private actualiteService: ActualiteService,
    private messageService: MessageService,

  ) {}

  ngOnInit() {
    this.actualite = { _id: '' }; 
    this.uploadedFiles = []; 
    this.getAllActualites();
  }

  showFullDescription(description: string) {
    this.selectedDescription = description;
    this.displayModal = true;
}

  openNew() {
    this.actualite = {
      _id: '',
    };
    this.submitted = false;
    this.actualiteDialog = true;
    this.actionLabel = 'Enregistrer';

  }

  editActualite(actualite: Actualite) {
    this.actualite = { ...actualite };
    this.actualiteDialog = true;
    this.actionLabel = 'Modifier';
  }

  deleteActualite(actualite: Actualite) {
    if (actualite && actualite._id) {
      this.deleteActualiteDialog = true;
      this.actualite = { ...actualite };
    } else {
      console.error('actualite object is missing ID:', actualite);
    }
  }

  confirmDelete() {
    if (this.actualite && this.actualite._id) {
      this.actualiteService.deleteActualite(this.actualite._id).subscribe(
        response => {
          this.actualites = this.actualites.filter(val => val._id !== this.actualite._id);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'actualite Deleted', life: 3000 });
          this.actualite = {
            _id: '',
          };
          this.deleteActualiteDialog = false;
        },
        error => {
          console.error('Error deleting actualite:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to Delete actualite', life: 3000 });
          this.deleteActualiteDialog = false;
        }
      );
    } else {
      console.error('Invalid actualite ID:', this.actualite);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid actualite ID', life: 3000 });
      this.deleteActualiteDialog = false;
    }
  }

  hideDialog() {
    this.actualiteDialog = false;
    this.submitted = false;
  }

  saveActualite(): void {
    // Vérifier que tous les champs obligatoires sont remplis et un service est sélectionné
    if (!this.actualite.nom || !this.actualite.description  ) {
        console.error('Veuillez remplir tous les champs obligatoires ou sélectionner un service valide.');
        return;
    }

    const formData = new FormData();
    formData.append('nom', this.actualite.nom);
    formData.append('description', this.actualite.description);
    formData.append('image', this.uploadedFiles[0]);

    console.log('Données envoyées au backend :', formData);

    if (this.actualite._id) {
        // Mettre à jour le actualite existant
        this.actualiteService.putActualite(this.actualite._id, formData).subscribe(
            res => {
                console.log('Réponse du backend pour la mise à jour du actualite :', res);
                this.actualiteDialog = false;
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'actualite mis à jour', life: 3000 });
                this.getAllActualites();
              },
            (error: HttpErrorResponse) => {
                console.error('Erreur lors de la mise à jour de l\'produit:', error);
                this.messageService.add({ severity: 'error', summary: 'Erreur lors de la mise à jour de l\'actualite', detail: error.message });
            }
        );
    } else {
        // Ajouter un nouveau actualite
        this.actualiteService.addActualite(formData).subscribe(
            res => {
                console.log('Réponse du backend pour l\'ajout du actualite :', res);
                this.actualiteDialog = false;
                this.actualite = { _id: '' };
                this.uploadedFiles = [];
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'actualite ajoutée', life: 3000 });
                this.getAllActualites();

              },
            (error: HttpErrorResponse) => {
                console.error('Erreur lors de l\'ajout de l\'actualite:', error);
                this.messageService.add({ severity: 'error', summary: 'Erreur lors de l\'ajout de\'actualite', detail: error.message });
            }
        );
    }
}

getAllActualites(): void {
  this.actualiteService.getActualite().subscribe(
    actualites => {
      this.actualites = actualites;
      console.log("actualites récupérés:", this.actualites);
    },
    error => {
      console.error('Erreur lors de la récupération des actualites:', error);
    }
  );
}

onGlobalFilter(table: any, event: Event) {
  table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
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

getImageUrl(imageName: string): string {
  return `${imageName}`;
}

openActualiteDialog(actualite: Actualite): void {
  console.log('actualite reçu :', actualite);

  this.actualite = { ...actualite };

  this.actualiteImageUrl = this.getImageUrl(actualite.image!); 
  this.selectedActualites = [actualite]; 

  this.actualiteDialog = true;
  this.actionLabel = 'Passer une commande';
}
}
