import { Component } from '@angular/core';
import { Reunion } from '../../models/reunion';
import { ReunionService } from '../../service/reunion.service';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-reunion',
  templateUrl: './reunion.component.html',
  styleUrl: './reunion.component.scss'
})
export class ReunionComponent {
  reunions: Reunion[] = [];
  selectedReunions: Reunion[] = [];
  reunion: Reunion = {
    _id: '',
  };
  reunionDialog: boolean = false;
  deleteReunionDialog: boolean = false;
  submitted: boolean = false;
  actionLabel: string = 'Enregistrer';
  cols: any[] = [];
  rowsPerPageOptions = [5, 10, 20];
  reunionForm!: FormGroup;
  heureDebut: Date | null = null; // Initialise la variable heureDebut
  heureFin: Date | null = null; // Initialise la variable heureFin
  selectedStatuses: { [key: string]: string } = {}; // Tableau pour stocker les statuts sélectionnés par commande
  statusOptions: any[] = [
    { label: 'En attente', value: 'En attente' },
    { label: 'Confirmée', value: 'Confirmée' },
    { label: 'Refusée', value: 'Refusée' }


    // Ajoutez d'autres options de statut au besoin
  ];

  showCalendar: boolean = false;
  events: any[] = [];
  calendarOptions!: CalendarOptions;
  constructor(
    private reunionService: ReunionService,private messageService: MessageService,
    private formBuilder: FormBuilder,

  ) {}

  ngOnInit() {
    this.reunion = { _id: '' }; 
    this.getAllReunions()
    this.initializeForm();
    this.initializeCalendarOptions();
  }

  initializeForm() {
    this.reunionForm = this.formBuilder.group({
      nom: ['', Validators.required],
      description: [''],
      date: [null, Validators.required],
      heureDebut: [null, Validators.required],
      heureFin: [null, Validators.required],
      logiciel: ['', Validators.required]  // Ajout d'un tableau pour les cases à cocher

    });
  }
  
  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  openNew() {
    this.reunion = {
      _id: '',
    };
    this.submitted = false;
    this.reunionDialog = true;
    this.actionLabel = 'Enregistrer';

  }

  openReunionDialog(reunion: Reunion): void {
    console.log('reunion reçu :', reunion);
  
    this.reunion = { ...reunion };
  
    this.selectedReunions = [reunion]; 
  
    this.reunionDialog = true;
  }

  editReunion(reunion: Reunion) {
    this.reunion = { ...reunion };

    this.reunionForm.patchValue({
        nom: reunion.nom,
        description: reunion.description,
        date: reunion.date ? new Date(reunion.date) : null,
        heureDebut: reunion.heureDebut,
        heureFin: reunion.heureFin,
        logiciel: reunion.logiciel || ''  // Remplir avec la valeur du logiciel
    });

    this.reunionDialog = true;
    this.actionLabel = 'Modifier';
}



  deleteReunion(reunion: Reunion) {
    if (reunion && reunion._id) {
      this.deleteReunionDialog = true;
      this.reunion = { ...reunion };
    } else {
      console.error('reunion object is missing ID:', reunion);
    }
  }


  confirmDelete() {
    if (this.reunion && this.reunion._id) {
      this.reunionService.deleteReunion(this.reunion._id).subscribe(
        response => {
          this.reunions = this.reunions.filter(val => val._id !== this.reunion._id);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'reunion Deleted', life: 3000 });
          this.reunion = {
            _id: '',
          };
          this.deleteReunionDialog = false;
        },
        error => {
          console.error('Error deleting produit:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to Delete produit', life: 3000 });
          this.deleteReunionDialog = false;
        }
      );
    } else {
      console.error('Invalid reunion ID:', this.reunion);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid reunion ID', life: 3000 });
      this.deleteReunionDialog = false;
    }
  }

  hideDialog() {
    this.reunionDialog = false;
    this.submitted = false;
  }

  saveReunion(): void {
    this.submitted = true;

    if (this.reunionForm.invalid) {
        console.error('Veuillez remplir tous les champs obligatoires.');
        return;
    }


    const requestData = {
      nom: this.reunionForm.get('nom')?.value,
      description: this.reunionForm.get('description')?.value,
      date: this.reunionForm.get('date')?.value ? this.reunionForm.get('date')?.value.toISOString().split('T')[0] : '',
      heureDebut: this.reunionForm.get('heureDebut')?.value ? this.reunionForm.get('heureDebut')?.value.toISOString().split('T')[1].substring(0, 5) : '',
      heureFin: this.reunionForm.get('heureFin')?.value ? this.reunionForm.get('heureFin')?.value.toISOString().split('T')[1].substring(0, 5) : '',
      createur: localStorage.getItem('user_id') || '',
      logiciel: this.reunionForm.get('logiciel')?.value,  // Inclure la valeur du logiciel
      deuxiemeMembre: 'admin@gmail.com'
    };

    console.log('Données envoyées:', requestData);

    if (this.reunion._id) {
        // Mise à jour
        this.reunionService.putReunion(this.reunion._id, requestData).subscribe(
            res => {
                console.log('Réponse du backend pour la mise à jour de la réunion :', res);
                this.reunionDialog = false;
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Réunion mise à jour', life: 3000 });
                this.getAllReunions();
            },
            error => {
                console.error('Erreur lors de la mise à jour de la réunion :', error);
                this.messageService.add({ severity: 'error', summary: 'Erreur lors de la mise à jour de la réunion', detail: error.message });
            }
        );
    } else {
        // Ajouter une nouvelle réunion
        this.reunionService.addReunion(requestData).subscribe(
            res => {
                console.log('Réponse du backend pour l\'ajout de la réunion :', res);
                this.reunionDialog = false;
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Réunion ajoutée', life: 3000 });
                this.getAllReunions();
            },
            error => {
                console.error('Erreur lors de l\'ajout de la réunion :', error);
                this.messageService.add({ severity: 'error', summary: 'Erreur lors de l\'ajout de la réunion', detail: error.message });
            }
        );
    }
}











// getAllReunions(): void {
//   this.reunionService.getReunion().subscribe(
//     reunions => {
//       this.reunions = reunions;
//       reunions.forEach(reunion => {
//         this.selectedStatuses[reunion._id] = reunion.status || ''; // Initialiser selectedStatuses avec le statut actuel
//       });
//       console.log("reunions récupérés:", this.reunions);
//     },
//     error => {
//       console.error('Erreur lors de la récupération des reunions:', error);
//     }
//   );
// }


getAllReunions(): void {
  this.reunionService.getReunion().subscribe(
    reunions => {
      console.log('reunion récupérés:', reunions); // Debugging
      this.reunions = reunions;
      this.events = reunions.map(reunion => ({
        title: `Nom : ${reunion.nom} <br> Status : ${reunion.status} <br> de : ${reunion.heureDebut} <br> à : ${reunion.heureFin}`,
        start: reunion.date,


        extendedProps: {
          description: reunion.description,
          status: reunions.forEach(reunion => {
            this.selectedStatuses[reunion._id] = reunion.status || ''; // Initialiser selectedStatuses avec le statut actuel
          })

        }
      }));
      this.initializeCalendarOptions();

    },
    error => {
      console.error('Erreur lors de la récupération des projets:', error);
    }
  );
}

onGlobalFilter(table: any, event: Event) {
  table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
}


// onStatusChange(reunion: Reunion, event: any) {
//   const newStatus = event.value;
//   this.reunionService.updateReunionStatus(reunion._id, newStatus).subscribe(
//     (updatedReunion: Reunion) => {
//       const index = this.reunions.findIndex(o => o._id === updatedReunion._id);
//       if (index !== -1) {
//         this.reunions[index] = updatedReunion;
//         this.selectedStatuses[updatedReunion._id] = updatedReunion.status || ''; // Utilisation d'une valeur par défaut
//         this.showMessage('success', 'Succès', 'Statut modifié');
//       }
//     },
//     (error) => {
//       console.error('Erreur lors de la mise à jour du statut de la reunion :', error.message, error.status);
//       this.showMessage('error', 'Erreur', `Erreur lors de la mise à jour du statut : ${error.message}`);
//     }
//   );
// }


onStatusChange(reunion: Reunion, event: any) {
  const newStatus = event.value;

  // Mettez à jour le statut de la réunion
  this.reunionService.updateReunionStatus(reunion._id, newStatus).subscribe(
    (updatedReunion: Reunion) => {
      const index = this.reunions.findIndex(o => o._id === updatedReunion._id);
      if (index !== -1) {
        this.reunions[index] = updatedReunion;
        this.selectedStatuses[updatedReunion._id] = updatedReunion.status || ''; // Utilisation d'une valeur par défaut

        // Si le nouveau statut est "Refusée", supprimez la réunion
        if (updatedReunion.status === 'Refusée') {
          this.reunionService.deleteReunion(updatedReunion._id).subscribe(
            () => {
              // Mise à jour de la liste des réunions après suppression
              this.reunions = this.reunions.filter(val => val._id !== updatedReunion._id);
              this.messageService.add({ severity: 'success', summary: 'Réunion supprimée', detail: 'La réunion a été supprimée avec succès', life: 3000 });
            },
            (error) => {
              console.error('Erreur lors de la suppression de la réunion :', error.message);
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: `Échec de la suppression de la réunion : ${error.message}`, life: 3000 });
            }
          );
        } else {
          this.showMessage('success', 'Succès', 'Statut modifié');
        }
      }
    },
    (error) => {
      console.error('Erreur lors de la mise à jour du statut de la réunion :', error.message, error.status);
      this.showMessage('error', 'Erreur', `Erreur lors de la mise à jour du statut : ${error.message}`);
    }
  );
}

private showMessage(severity: string, summary: string, detail: string): void {
  this.messageService.add({ severity, summary, detail, life: 3000 });
}


initializeCalendarOptions() {
  this.calendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev',
      center: 'title',
      right: 'next',
    },
    initialView: 'dayGridMonth',
    locale: 'fr', // Configuration en français
    height: '500px', // Ajuster la hauteur du calendrier
    events: this.events,
    eventContent: this.renderEventContent
  };
}

renderEventContent(eventInfo: any) {
  return {
    html: `
      <div>
        <b>${eventInfo.event.title}</b>
      </div>`
  };
}


  toggleCalendar() {
  this.showCalendar = !this.showCalendar; // Basculer l'affichage du calendrier
}

}
