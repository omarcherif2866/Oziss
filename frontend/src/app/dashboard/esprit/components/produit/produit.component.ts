import { Component } from '@angular/core';
import { Service } from '../../models/service';
import { MessageService } from 'primeng/api';
import { ServiceService } from '../../service/service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Table } from 'primeng/table';
import { ProduitService } from '../../service/produit.service';
import { Produit } from '../../models/produit';
import { Monnaie, Order } from '../../models/order';
import { User } from '../../models/user';
import { OrderService } from '../../service/order.service';

@Component({
  selector: 'app-produit',
  templateUrl: './produit.component.html',
  styleUrl: './produit.component.scss'
})
export class ProduitComponent {
  displayModal: boolean = false; // Contrôle la visibilité du modal
  selectedDescription: string = ''; // Contient la description sélectionnée

  produitDialog: boolean = false;
  actionLabel: string = 'Enregistrer';
  deleteProduitDialog: boolean = false;
  produits: Produit[] = [];
  services: Service[] = [];
  produit: Produit = {
    _id: '',
    service: null
  };
  selectedProduits: Produit[] = [];
  produitImageUrl!: string; // Déclaration de l'URL de l'image du produit

  submitted: boolean = false;
  serviceOptions: any[] = [];
  selectedService: Service | null = null;
  order: Order = {
    _id: '',
    client: {} as User,
    produits: [],
    besoin: '',
    budget: 0,
    pdf:[],
    status: 'En attente'
  };
  uploadedFiles: File[] = [];

  cols: any[] = [];
  statuses: any[] = [];
  rowsPerPageOptions = [5, 10, 20];

  constructor(
    private productService: ProduitService,
    private messageService: MessageService,
    private serviceService: ServiceService,
    private orderService: OrderService

  ) {}

  ngOnInit() {
    this.selectedService = null; // Initialisation de selectedService
    this.produit = { _id: '', service: null }; // Initialiser le produit
    this.uploadedFiles = []; // Initialiser les fichiers téléchargés
    this.getAllServices();
    this.getAllProducts();
  }

  showFullDescription(description: string): void {
    this.selectedDescription = description; // Assignez la description complète
    this.displayModal = true; // Affiche le modal
}



  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  openNew() {
    this.produit = {
      _id: '',
      service: null
    };
    this.submitted = false;
    this.produitDialog = true;
    this.actionLabel = 'Enregistrer';

  }

  editProduct(produit: Produit) {
    this.produit = { ...produit };
    
    // Vérifiez si produit.service et produit.service._id existent
    if (produit.service && produit.service._id) {
        this.selectedService = this.services.find(service => service._id === produit.service!._id) || null;
    } else {
        // Si l'ID du service est manquant, on peut affecter un service nul ou une valeur par défaut
        this.selectedService = null;
    }
    
    this.produitDialog = true;
    this.actionLabel = 'Modifier';
}


  deleteProduct(produit: Produit) {
    if (produit && produit._id) {
      this.deleteProduitDialog = true;
      this.produit = { ...produit };
    } else {
      console.error('produit object is missing ID:', produit);
    }
  }

  confirmDelete() {
    if (this.produit && this.produit._id) {
      console.log("ID du produit à supprimer:", this.produit._id); // Log de vérification
      this.productService.deleteProduct(this.produit._id).subscribe(
        response => {
          this.produits = this.produits.filter(val => val._id !== this.produit._id);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Produit supprimé', life: 3000 });
          this.produit = {
            _id: '',
            service: null
          };
          this.selectedService = null;
          this.deleteProduitDialog = false;
        },
        error => {
          console.error('Erreur lors de la suppression du produit:', error);
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de la suppression du produit', life: 3000 });
          this.deleteProduitDialog = false;
        }
      );
    } else {
      console.error('ID de produit invalide:', this.produit);
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'ID de produit invalide', life: 3000 });
      this.deleteProduitDialog = false;
    }
  }
  

  hideDialog() {
    this.produitDialog = false;
    this.submitted = false;
  }

  saveProduct(): void {
    if (!this.produit.nom || !this.produit.description) {
      console.error('Veuillez remplir tous les champs obligatoires.');
      return;
    }
  
    const formData = new FormData();
    formData.append('nom', this.produit.nom);
    formData.append('description', this.produit.description);
    formData.append('image', this.uploadedFiles[0]);
  
    // Ajouter l'ID du service uniquement si un service est sélectionné et que ce n'est pas "Aucun"
    if (this.selectedService && this.selectedService._id !== '') {
      formData.append('service', this.selectedService._id);
    } else {
      // Si "Aucun" est sélectionné, ne pas ajouter le champ service
      console.log('Service non sélectionné, champ service non ajouté');
    }
  
    console.log('Données envoyées au backend :', formData);
  
    if (this.produit._id) {
      // Mettre à jour le produit existant
      this.productService.putProduct(this.produit._id, formData).subscribe(
        res => {
          console.log('Réponse du backend pour la mise à jour du produit :', res);
          this.produitDialog = false;
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Produit mis à jour', life: 3000 });
          this.getAllProducts();
        },
        (error: HttpErrorResponse) => {
          console.error('Erreur lors de la mise à jour du produit:', error);
          this.messageService.add({ severity: 'error', summary: 'Erreur lors de la mise à jour du produit', detail: error.message });
        }
      );
    } else {
      // Ajouter un nouveau produit
      this.productService.addProduct(formData).subscribe(
        res => {
          console.log('Réponse du backend pour l\'ajout du produit :', res);
          this.produitDialog = false;
          this.produit = { _id: '', service: null };
          this.uploadedFiles = [];
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Produit ajouté', life: 3000 });
          this.getAllProducts();
        },
        (error: HttpErrorResponse) => {
          console.error('Erreur lors de l\'ajout du produit:', error);
          this.messageService.add({ severity: 'error', summary: 'Erreur lors de l\'ajout du produit', detail: error.message });
        }
      );
    }
  }
  
  



  
  
  

// Ajoutez un service "aucun" pour être sélectionné si l'utilisateur ne souhaite pas associer de service
getAllServices(): void {
  this.serviceService.getService().subscribe(ss => {
    this.services = [{ _id: '', nom: 'Aucun' }, ...ss]; // Ajout du service "Aucun"
    console.log("services récupérées:", ss);
  });
}


  getAllProducts(): void {
    this.productService.getProduct().subscribe(
      produits => {
        this.produits = produits;
        console.log("Produits récupérés:", this.produits);
      },
      error => {
        console.error('Erreur lors de la récupération des produits:', error);
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

  getServiceNom(serviceId: string): string {
    const service = this.services.find(s => s._id === serviceId);
    return service?.nom ?? ''; // Utilise la valeur par défaut '' si service.nom est undefined
  }
  


openProductDialog(produit: Produit): void {
  console.log('Produit reçu :', produit);

  this.produit = { ...produit };

  console.log('Services récupérés :', this.services);

  if (typeof produit.service === 'string') {
    const serviceID = produit.service;

    this.selectedService = this.services.find(service => service._id === serviceID) || null;
  } else if (typeof produit.service === 'object') {
    this.selectedService = produit.service;
  } else {
    this.selectedService = null;
  }

  this.produitImageUrl = this.getImageUrl(produit.image!); 
  this.selectedProduits = [produit]; 

  this.produitDialog = true;
  this.order.besoin = '';
  this.actionLabel = 'Passer une commande';
}

saveOrder(): void {
  const clientId = localStorage.getItem('user_id');

  if (!clientId) {
    console.error('Client ID non trouvé dans le localStorage');
    return;
  }

  // Convertir les produits sélectionnés en un tableau d'objets avec l'ID du produit
  const produitsToSend: any[] = this.selectedProduits.map(product => ({
    produit: product._id,
  }));

  // Créer un objet FormData pour envoyer la commande avec les fichiers PDF
  const formData = new FormData();
  formData.append('client', clientId);
  formData.append('produits', JSON.stringify(produitsToSend));
  formData.append('besoin', this.order.besoin);
  formData.append('budget', this.order.budget.toString());
  formData.append('monnaie', this.order.monnaie || '');


  // Ajouter chaque fichier PDF à FormData avec son nom
  for (let i = 0; i < this.order.pdf.length; i++) {
    const file = this.order.pdf[i];
    formData.append('pdf', file, file.name); // Assurez-vous que `file` est un objet `File`
  }

  console.log('Order à envoyer avant createOrder() :', formData);

  // Appel du service pour créer la commande
  this.orderService.createOrder(formData)
    .subscribe(
      (createdOrder) => {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Commande créée avec succès', life: 3000 });
        console.log('Commande créée avec succès :', createdOrder);
      },
      (error) => {
        console.error('Erreur lors de la création de la commande :', error);
      }
    );
}


monnaieOptions = Object.keys(Monnaie).map(key => ({ label: Monnaie[key as keyof typeof Monnaie], value: Monnaie[key as keyof typeof Monnaie] }));



onSelectPDF(event: any): void {
  const files: FileList = event?.files; // Utiliser `files` pour obtenir les fichiers sélectionnés

  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file) {
        this.order.pdf.push(file); // Ajouter le nom du fichier PDF à la liste des PDF de la commande
      }
    }
  }

  console.log('Fichiers PDF sélectionnés :', this.order.pdf); // Afficher les noms des fichiers PDF sélectionnés
}
}

