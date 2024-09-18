import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/user';
import { ServiceService } from '../../service/service.service';
import { MessageService } from 'primeng/api';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-commercial',
  templateUrl: './commercial.component.html',
  styleUrl: './commercial.component.scss'
})
export class CommercialComponent {
  commercialeForm!: FormGroup;
  commercialeDialog: boolean = false;
  deletecommercialeDialog: boolean = false;
  commerciales: User[] = [];
  commerciale: User = { _id: '' };
  uploadedFiles: File[] = [];
  actionLabel: string = 'Enregistrer';
  submitted: boolean = false;
  cols!: any[];
  selectedCommerciale: User[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.commercialeForm = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8), 
        Validators.pattern('^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$')  // Au moins 1 majuscule, 1 chiffre, 1 symbole
      ]],
      phoneNumber: ['', Validators.required],
      image: [null],
    });
    this.getAllCommerciales()
  }
  
  

  openNew() {
    this.commerciale = { _id: '' };
    this.commercialeForm.reset();
    this.commercialeDialog = true;
  }

  editCommerciale(commerciale: User) {
    this.commerciale = { ...commerciale };
    this.commercialeDialog = true;
    this.actionLabel = 'Modifier';
    this.commercialeForm.patchValue(this.commerciale); // Assurez-vous que le formulaire est mis à jour
  }
  

  deleteCommerciale(commerciale: User) {
    if (commerciale && commerciale._id) {
      this.deletecommercialeDialog = true;
      this.commerciale = { ...commerciale };
    } else {
      console.error('commerciale object is missing ID:', commerciale);
    }
  }

  confirmDelete() {
    if (this.commerciale && this.commerciale._id) {
      this.userService.deleteUser(this.commerciale._id).subscribe(
        response => {
          this.commerciales = this.commerciales.filter(val => val._id !== this.commerciale._id);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'commerciale Deleted', life: 3000 });
          this.commerciale = {
            _id: '',
          };
          this.deletecommercialeDialog = false;
        },
        error => {
          console.error('Error deleting commerciale:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to Delete commerciale', life: 3000 });
          this.deletecommercialeDialog = false;
        }
      );
    } else {
      console.error('Invalid commerciale ID:', this.commerciale);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid commerciale ID', life: 3000 });
      this.deletecommercialeDialog = false;
    }
  }

  hideDialog() {
    this.commercialeDialog = false;
    this.submitted = false;
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
    return `http://localhost:9090/img/${imageName}`;
  }

  saveCommercial() {
    this.submitted = true;
  
    if (this.commercialeForm.invalid) {
      return;
    }
  
    const commercialData = new FormData();
    commercialData.append('nom', this.commercialeForm.get('nom')!.value);
    commercialData.append('password', this.commercialeForm.get('password')!.value);
    commercialData.append('email', this.commercialeForm.get('email')!.value);
    commercialData.append('phoneNumber', this.commercialeForm.get('phoneNumber')!.value);
  
    if (this.uploadedFiles) {
      commercialData.append('image', this.uploadedFiles[0]);
    }
  
    this.userService.addCommerciale(commercialData).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Commercial ajouté avec succès' });
        this.commercialeDialog = false;
        this.commercialeForm.reset();
        window.location.reload();
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de l\'ajout du commercial' });
      }
    );
  }
  
  getAllCommerciales(): void {
    this.userService.getUser().subscribe(ss => {
      // Afficher les utilisateurs récupérés dans la console
      console.log("Users récupérées:", ss);
      
      // Filtrer les utilisateurs pour ne garder que ceux avec userType = 'client'
      this.commerciales = ss.filter(user => user.userType === 'commercial');
      
      // Afficher les utilisateurs filtrés dans la console pour vérification
      console.log("commerciales filtrés:", this.commerciales);
    }, error => {
      // Gestion des erreurs
      console.error("Erreur lors de la récupération des utilisateurs:", error);
    });
  }

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

}
