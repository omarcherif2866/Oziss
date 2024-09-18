import { Component, OnInit } from '@angular/core';
import { Service } from '../../models/service';
import { ServiceService } from '../../service/service.service';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { Table } from 'primeng/table';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-service',
  providers: [MessageService],
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss'
})

export class ServiceComponent implements OnInit {
  serviceForm!: FormGroup;
  serviceDialog: boolean = false;
  deleteServiceDialog: boolean = false;
  services: Service[] = [];
  service: Service = { _id: '' };
  uploadedFiles: File[] = [];
  actionLabel: string = 'Enregistrer';
  submitted: boolean = false;
  cols!: any[];
  selectedService: Service[] = [];

  constructor(
    private fb: FormBuilder,
    private serviceService: ServiceService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.serviceForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      image: [null],  // Image n'est pas requis
      subdesc: this.fb.array([this.fb.control('', Validators.required)])
    });
    

    this.cols = [
      { field: 'nom', header: 'Nom' },
      { field: 'description', header: 'Description' },
      { field: 'subDesc', header: 'Sous Description' },
      { field: 'actions', header: 'Actions' }
    ];

    this.getAllServices();
  }

  get subdesc() {
    return this.serviceForm.get('subdesc') as FormArray;
  }

  openNew() {
    this.service = { _id: '' };
    this.serviceForm.reset();
    this.serviceForm.setControl('subdesc', this.fb.array([this.fb.control('', [Validators.maxLength(100)])]));
    this.serviceDialog = true;
  }

  editProduct(service: Service) {
    this.service = { ...service };
    this.serviceForm.patchValue({
      nom: service.nom,
      description: service.description,
      image: null
    });
    const subDescControls = service.subDesc!.map(desc => this.fb.control(desc, [Validators.maxLength(100)]));
    this.serviceForm.setControl('subdesc', this.fb.array(subDescControls));
    this.serviceDialog = true;
    this.actionLabel = 'Modifier';
  }

  addSubDesc() {
    this.subdesc.push(this.fb.control(''));
  }

  removeSubDesc(index: number) {
    this.subdesc.removeAt(index);
  }

  saveService() {
    this.submitted = true;
    if (this.serviceForm.invalid) {
      console.error('Formulaire invalide:', this.serviceForm.value);
      return;
    }

    const formData = new FormData();
    formData.append('nom', this.serviceForm.get('nom')!.value);
    formData.append('description', this.serviceForm.get('description')!.value);
    if (this.uploadedFiles.length > 0) {
      formData.append('image', this.uploadedFiles[0]);
    }
    this.serviceForm.get('subdesc')!.value.forEach((desc: string, index: number) => {
      formData.append(`subDesc[${index}]`, desc);
    });

    if (this.service._id) {
      this.serviceService.putService(this.service._id, formData).subscribe(
        res => {
          this.serviceDialog = false;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Service mis à jour', life: 3000 });
          window.location.reload();
        },
        (error: HttpErrorResponse) => {
          console.error('Erreur lors de la mise à jour du service:', error);
          this.messageService.add({ severity: 'error', summary: 'Erreur lors de la mise à jour du service', detail: error.message });
        }
      );
    } else {
      this.serviceService.addService(formData).subscribe(
        res => {
          this.serviceDialog = false;
          this.service = { _id: '' };
          this.uploadedFiles = [];
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Service ajouté', life: 3000 });
          window.location.reload();
        },
        (error: HttpErrorResponse) => {
          console.error('Erreur lors de l\'ajout du service:', error);
          this.messageService.add({ severity: 'error', summary: 'Erreur lors de l\'ajout du service', detail: error.message });
        }
      );
    }
  }

  getAllServices() {
    this.serviceService.getService().subscribe(ss => {
      this.services = ss;
      console.log("services récupérées:", ss);
    });
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

  hideDialog() {
    this.serviceDialog = false;
    this.submitted = false;
    this.serviceForm.reset();
    this.subdesc.clear();
  }

  getImageUrl(imageName: string): string {
    return `http://localhost:9090/img/${imageName}`;
  }

  toFormControl(control: AbstractControl): FormControl {
    return control as FormControl;
  }

  deleteProduct(service: Service) {
    if (service && service._id) {
      this.deleteServiceDialog = true;
      this.service = { ...service };
    } else {
      console.error('service object is missing ID:', service);
    }
  }

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }
}


