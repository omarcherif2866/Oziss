import { Component } from '@angular/core';
import { Projet } from '../../models/projet';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ProjetService } from '../../service/projet.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core';
import { UserService } from '../../service/user.service';
import { User } from '../../models/user';
@Component({
  selector: 'app-projet',
  templateUrl: './projet.component.html',
  styleUrl: './projet.component.scss'
})
export class ProjetComponent {
  projets: Projet[] = [];
  selectedProjets: Projet[] = [];
  projet: Projet = {
    _id: '',
  };
  projetDialog: boolean = false;
  projetForm!: FormGroup;
  submitted: boolean = false;
  actionLabel: string = 'Enregistrer';
  cols: any[] = [];
  rowsPerPageOptions = [5, 10, 20];
  statusOptions: any[] = [
    { label: 'En attente', value: 'En attente' },
    { label: 'Terminé', value: 'Terminé' },
    { label: 'En cours', value: 'En cours' }
  ];
  deleteProjetDialog: boolean = false;
  selectedStatuses: { [key: string]: string } = {}; // Tableau pour stocker les statuts sélectionnés par commande
  Users: User[] = [];
  admin: User[] = [];

  adminId: string | null = null;
  showCalendar: boolean = false;
  events: any[] = [];
  calendarOptions!: CalendarOptions;
  constructor(
    private projetService: ProjetService,private messageService: MessageService,
    private formBuilder: FormBuilder, private sanitizer: DomSanitizer,
    private userService: UserService


  ) {}
  ngOnInit() {
    this.projet = { _id: '' }; 
    this.getAllProjets()
    this.initializeForm();
    this.initializeCalendarOptions();
    this.getAllPartners()
    this.getAdmin()
  }

  initializeForm() {
    this.projetForm = this.formBuilder.group({
      nom: ['', Validators.required],
      description: [''],
      dateDebut: [null, Validators.required],
      with: [null],  // Ajoutez ce champ au formulaire

    });
  }
  
  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  getUserId(): string {
    return localStorage.getItem('user_id') || ''; // Retourne l'ID de l'utilisateur connecté
  }


  openNew() {
    this.projet = {
      _id: '',
    };
    this.submitted = false;
    this.projetDialog = true;
    this.actionLabel = 'Enregistrer';

  }

  openProjetDialog(projet: Projet): void {
    console.log('projet reçu :', projet);
  
    this.projet = { ...projet };
  
    this.selectedProjets = [projet]; 
  
    this.projetDialog = true;
  }

  editProjet(projet: Projet) {
      this.projet = { ...projet };

      this.projetForm.patchValue({
          nom: projet.nom,
          description: projet.description,
          dateDebut: projet.dateDebut ? new Date(projet.dateDebut) : null,
      });

      this.projetDialog = true;
      this.actionLabel = 'Modifier';
  }

  deleteProjet(projet: Projet) {
    if (projet && projet._id) {
      this.deleteProjetDialog = true;
      this.projet = { ...projet };
    } else {
      console.error('projet object is missing ID:', projet);
    }
  }

  confirmDelete() {
    if (this.projet && this.projet._id) {
      this.projetService.deleteProjet(this.projet._id).subscribe(
        response => {
          this.projets = this.projets.filter(val => val._id !== this.projet._id);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'projet Deleted', life: 3000 });
          this.projet = {
            _id: '',
          };
          this.deleteProjetDialog = false;
        },
        error => {
          console.error('Error deleting projet:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to Delete projet', life: 3000 });
          this.deleteProjetDialog = false;
        }
      );
    } else {
      console.error('Invalid reunion ID:', this.projet);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid reunion ID', life: 3000 });
      this.deleteProjetDialog = false;
    }
  }

  hideDialog() {
    this.projetDialog = false;
    this.submitted = false;
  }

  // saveProjet(): void {
  //   this.submitted = true;
  
  //   if (this.projetForm.invalid) {
  //     console.error('Veuillez remplir tous les champs obligatoires.');
  //     return;
  //   }
  
  //   // Création de l'objet FormData
  //   const formData = new FormData();
  //   formData.append('nom', this.projetForm.get('nom')?.value);
  //   formData.append('description', this.projetForm.get('description')?.value);
  // // Récupération et formatage de la date
  // const dateDebut = this.projetForm.get('dateDebut')?.value;
  // if (dateDebut) {
  //   console.log('Date avant formatage:', dateDebut);
  //   const formattedDate = dateDebut.toISOString().split('T')[0];
  //   console.log('Date formatée:', formattedDate);
  //   formData.append('dateDebut', formattedDate);
  // } else {
  //   console.warn('La date de début est vide ou non définie.');
  // }
  
  //   for (let i = 0; i < this.projet.pdf!.length; i++) {
  //     const file = this.projet.pdf![i];
  //     formData.append('pdf', file, file.name); // Assurez-vous que `file` est un objet `File`
  //   }
  
  //   console.log('Données envoyées:', formData);
  
  //   if (this.projet._id) {
  //     // Mise à jour du projet
  //     this.projetService.putProjet(this.projet._id, formData).subscribe(
  //       res => {
  //         console.log('Réponse du backend pour la mise à jour du projet :', res);
  //         this.projetDialog = false;
  //         this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Projet mis à jour', life: 3000 });
  //         this.getAllProjets();
  //       },
  //       error => {
  //         console.error('Erreur lors de la mise à jour du projet :', error);
  //         this.messageService.add({ severity: 'error', summary: 'Erreur lors de la mise à jour du projet', detail: error.message });
  //       }
  //     );
  //   } else {
  //     // Ajouter un nouveau projet
  //     this.projetService.addProjet(formData).subscribe(
  //       res => {
  //         console.log('Réponse du backend pour l\'ajout du projet :', res);
  //         this.projetDialog = false;
  //         this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Projet ajouté', life: 3000 });
  //         this.getAllProjets();
  //       },
  //       error => {
  //         console.error('Erreur lors de l\'ajout du projet :', error);
  //         this.messageService.add({ severity: 'error', summary: 'Erreur lors de l\'ajout du projet', detail: error.message });
  //       }
  //     );
  //   }
  // }
  

  saveProjet(): void {
    this.submitted = true;
  
    if (this.projetForm.invalid) {
      console.error('Veuillez remplir tous les champs obligatoires.');
      return;
    }
  
    const formData = new FormData();
    formData.append('nom', this.projetForm.get('nom')?.value);
    formData.append('description', this.projetForm.get('description')?.value);
  
    const dateDebut = this.projetForm.get('dateDebut')?.value;
    if (dateDebut) {
      const formattedDate = dateDebut.toISOString().split('T')[0];
      formData.append('dateDebut', formattedDate);
    } else {
      console.warn('La date de début est vide ou non définie.');
    }
  
    if (this.projet.pdf) {
      for (let i = 0; i < this.projet.pdf.length; i++) {
        const file = this.projet.pdf[i];
        formData.append('pdf', file, file.name);
      }
    }
  
    const userRole = this.getUserRole();
    const userId = this.getUserId();
    let ownedBy = '';
    let withUser: string | null = null;
  
    if (userRole === 'admin') {
      ownedBy = userId;
      withUser = this.projetForm.get('with')?.value?._id || this.projetForm.get('with')?.value;
    } else if (userRole === 'partner') {
      ownedBy = userId;
      withUser = this.adminId ; // Utilisation de l'ID de l'admin ou valeur par défaut
    }
  
    formData.append('ownedBy', ownedBy);
    if (withUser) {
      formData.append('with', withUser); // Assurez-vous que withUser est une chaîne
    }
  
    if (this.projet._id) {
      this.projetService.putProjet(this.projet._id, formData).subscribe(
        res => {
          console.log('Réponse du backend pour la mise à jour du projet :', res);
          this.projetDialog = false;
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Projet mis à jour', life: 3000 });
          this.getAllProjets();
        },
        error => {
          console.error('Erreur lors de la mise à jour du projet :', error);
          this.messageService.add({ severity: 'error', summary: 'Erreur lors de la mise à jour du projet', detail: error.message });
        }
      );
    } else {
      this.projetService.addProjet(ownedBy, formData).subscribe(
        res => {
          console.log('Réponse du backend pour l\'ajout du projet :', res);
          this.projetDialog = false;
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Projet ajouté', life: 3000 });
          this.getAllProjets();
        },
        error => {
          console.error('Erreur lors de l\'ajout du projet :', error);
          this.messageService.add({ severity: 'error', summary: 'Erreur lors de l\'ajout du projet', detail: error.message });
        }
      );
    }
  }
  
  
  

  // getAllProjets(): void {
  //   this.projetService.getProjet().subscribe(
  //     projets => {
  //       console.log('Projets récupérés:', projets); // Debugging
  //       this.projets = projets;
  //       this.events = projets.map(projet => ({
  //         title: `Nom : ${projet.nom} <br> Status : ${projet.status}`,
  //         start: projet.dateDebut,
  //         extendedProps: {
  //           description: projet.description,
  //           status: projets.forEach(projet => {
  //             this.selectedStatuses[projet._id] = projet.status || ''; // Initialiser selectedStatuses avec le statut actuel
  //           })

  //         }
  //       }));
  //       this.initializeCalendarOptions();

  //     },
  //     error => {
  //       console.error('Erreur lors de la récupération des projets:', error);
  //     }
  //   );
  // }
  
  getAllProjets(): void {
    this.projetService.getProjetsByCriteria().subscribe(
      projets => {
        console.log('Projets récupérés:', projets); // Debugging
        this.projets = projets;
        this.events = projets.map(projet => ({
          title: `Nom : ${projet.nom} <br> Status : ${projet.status} <br> Créer par : ${projet.ownedBy?.email}<br> avec : ${projet.with?.email}`,
          start: projet.dateDebut,
          extendedProps: {
            description: projet.description,
            status: projets.forEach(projet => {
              this.selectedStatuses[projet._id] = projet.status || ''; // Initialiser selectedStatuses avec le statut actuel
            })          }
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

  onStatusChange(projet: Projet, event: any) {
    const newStatus = event.value;
  
    // Mettez à jour le statut de la réunion
    this.projetService.updateProjetStatus(projet._id, newStatus).subscribe(
      (updatedProjet: Projet) => {
        const index = this.projets.findIndex(o => o._id === updatedProjet._id);
        if (index !== -1) {
          this.projets[index] = updatedProjet;
          this.selectedStatuses[updatedProjet._id] = updatedProjet.status || ''; // Utilisation d'une valeur par défaut
            this.showMessage('success', 'Succès', 'Statut modifié');
          
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

  onSelectPDF(event: any): void {
    const files: FileList = event?.files; // Utiliser `files` pour obtenir les fichiers sélectionnés
  
    // Vérifiez que `this.projet.pdf` est bien un tableau, sinon, initialisez-le
    if (!this.projet.pdf) {
      this.projet.pdf = [];
    }
  
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file) {
          this.projet.pdf.push(file); // Ajouter le fichier PDF à la liste des PDF de la commande
        }
      }
    }
  
    console.log('Fichiers PDF sélectionnés :', this.projet.pdf); // Afficher les fichiers PDF sélectionnés
  }

  getPdfUrl(pdfName: string): SafeResourceUrl {
    const url = `http://localhost:9090/pdf/${pdfName}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
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
      eventContent: this.renderEventContent,

    };
  }

  renderEventContent(eventInfo: any) {
    return {
      html: `
        <div style="font-size: 0.8em; color: white; padding: 5px; border-radius: 3px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
          <b>${eventInfo.event.title}</b>
        </div>`
    };
  }
  
  

  
    toggleCalendar() {
    this.showCalendar = !this.showCalendar; // Basculer l'affichage du calendrier
  }

  getAllPartners(): void {
    this.userService.getUser().subscribe(ss => {
      // Afficher les utilisateurs récupérés dans la console
      console.log("Users récupérées:", ss);
      
      // Filtrer les utilisateurs pour ne garder que ceux avec userType = 'client'
      this.Users = ss.filter(user => user.userType === 'partner');
      
      // Afficher les utilisateurs filtrés dans la console pour vérification
      console.log("Partners filtrés:", this.Users);
    }, error => {
      // Gestion des erreurs
      console.error("Erreur lors de la récupération des utilisateurs:", error);
    });
  }

  getAdmin(): void {
    this.userService.getUser().subscribe(ss => {
      console.log("Users récupérées: ", ss);
      this.admin = ss.filter(user => user.userType === 'admin');
      console.log("admin filtré:", this.admin);

      // Vérifiez que la liste d'utilisateurs n'est pas vide et que _id est défini
      if (this.admin.length > 0 && this.admin[0]._id) {
        this.adminId = this.admin[0]._id;
      } else {
        this.adminId = null; // Assurez-vous que adminId est null si l'ID n'est pas disponible
      }
    }, error => {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
    });
  }
}
