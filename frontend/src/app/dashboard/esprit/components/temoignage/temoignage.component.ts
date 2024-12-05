import { Component } from '@angular/core';
import { Temoignage } from '../../models/temoignage';
import { TemoignageService } from '../../service/temoignage.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-temoignage',
  templateUrl: './temoignage.component.html',
  styleUrl: './temoignage.component.scss'
})
export class TemoignageComponent {
  temoignageDialog: boolean = false;
  actionLabel: string = 'Enregistrer';
  deleteTemoignageDialog: boolean = false;
  temoignages: Temoignage[] = [];
  temoignage: Temoignage = {
    _id: '',
  };
  selectedTemoignages: Temoignage[] = [];
  createurId: string | null = null; // Pour stocker l'ID du créateur

  submitted: boolean = false;

  cols: any[] = [];
  rowsPerPageOptions = [5, 10, 20];

  constructor(
    private temoignageService: TemoignageService,
    private messageService: MessageService,

  ) {}

  ngOnInit() {
    this.temoignage = { _id: '' }; 
    this.createurId = localStorage.getItem('user_id'); // Assurez-vous d'utiliser la bonne clé

    if (this.createurId) {
      this.loadTemoignages();
    }  }

  openNew() {
    this.temoignage = {
      _id: '',
    };
    this.submitted = false;
    this.temoignageDialog = true;
    this.actionLabel = 'Enregistrer';

  }

  deleteTemoignage(temoignage: Temoignage) {
    if (temoignage && temoignage._id) {
      this.deleteTemoignageDialog = true;
      this.temoignage = { ...temoignage };
    } else {
      console.error('temoignage object is missing ID:', temoignage);
    }
  }

  confirmDelete() {
    if (this.temoignage && this.temoignage._id) {
      this.temoignageService.deleteTemoignage(this.temoignage._id).subscribe(
        response => {
          this.temoignages = this.temoignages.filter(val => val._id !== this.temoignage._id);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'temoignage Deleted', life: 3000 });
          this.temoignage = {
            _id: '',
          };
          this.deleteTemoignageDialog = false;
        },
        error => {
          console.error('Error deleting temoignage:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to Delete temoignage', life: 3000 });
          this.deleteTemoignageDialog = false;
        }
      );
    } else {
      console.error('Invalid temoignage ID:', this.temoignage);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid temoignage ID', life: 3000 });
      this.deleteTemoignageDialog = false;
    }
  }

  hideDialog() {
    this.temoignageDialog = false;
    this.submitted = false;
  }

  saveTemoignage(): void {
    this.submitted = true;
  
    // Vérifier que le champ 'text' est rempli
    if (!this.temoignage.text) {
      console.error('Le champ "text" est requis.');
      return;
    }
  
    // Récupérer l'ID de l'utilisateur connecté depuis le localStorage
    const createurId = localStorage.getItem('user_id'); // Assurez-vous que l'ID est bien stocké sous cette clé
  
    if (!createurId) {
      console.error('Utilisateur non authentifié.');
      return;
    }
  
    // Ajouter l'ID du créateur au témoignage
    const temoignageData = {
      text: this.temoignage.text,
      createur: createurId,
    };
  
    // Appeler le service pour ajouter le témoignage
    this.temoignageService.addTemoignage(temoignageData).subscribe(
      (response) => {
        console.log('Témoignage ajouté avec succès :', response);
        this.temoignageDialog = false;
        this.submitted = false;
        this.temoignage = { _id: '', text: '', createur: undefined };
        this.loadTemoignages(); 
      },
      (error) => {
        console.error('Erreur lors de l\'ajout du témoignage :', error);
      }
    );
  }


  loadTemoignages(): void {
    if (this.createurId) {
      this.temoignageService.getTemoignagesByCreateur(this.createurId).subscribe(
        (temoignages: Temoignage[]) => {
          this.temoignages = temoignages;
        },
        (error) => {
          console.error('Erreur lors de la récupération des témoignages:', error);
        }
      );
    }
  }

}
