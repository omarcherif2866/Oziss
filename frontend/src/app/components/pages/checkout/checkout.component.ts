import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Produit } from '../../models/produit';
import { Monnaie, Order } from '../../models/order';
import { User } from '../../models/user';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  nomProduit: string | null = '';
  description: string | null = '';
  produitImageUrl!: string; // Déclaration de l'URL de l'image du produit
  besoin: string = '';
  selectedProduitId: string | null = null; // Pour stocker l'ID du produit sélectionné
  order: Order = {
    _id: '',
    client: {} as User,
    produits: [],
    besoin: '',
    budget:0,
    pdf:[],
    status: 'En attente'
  };

  isLoggedIn: boolean = false;
  

  constructor(private route: ActivatedRoute,private authService: AuthService, private orderService: OrderService, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.nomProduit = params['nomProduit'] || '';
      this.description = params['description'] || '';
      const imageName = params['imageProduit'] || '';
      this.produitImageUrl = this.getImageUrl(imageName);

      this.selectedProduitId = localStorage.getItem('selectedProduitId'); // Récupère l'ID du produit depuis le localStorage
    });

    this.authService.isLoggedIn().subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  saveOrder(): void {
    const clientId = localStorage.getItem('user_id');

    if (!clientId) {
      console.error('Client ID non trouvé dans le localStorage');
      return;
    }

    if (!this.selectedProduitId) {
      console.error('ID du produit non trouvé dans le localStorage');
      return;
    }

    const produitsToSend: any[] = [{ produit: this.selectedProduitId }]; // Utilisez l'ID du produit

    const formData = new FormData();
    formData.append('client', clientId);
    formData.append('produits', JSON.stringify(produitsToSend));
    formData.append('besoin', this.besoin);
    formData.append('budget', this.order.budget.toString());
    formData.append('monnaie', this.order.monnaie || '');

    for (let i = 0; i < this.order.pdf.length; i++) {
      const file = this.order.pdf[i];
      formData.append('pdf', file, file.name); // Assurez-vous que `file` est un objet `File`
    }

    console.log('Order à envoyer avant createOrder() :', formData);

    this.orderService.createOrder(formData)
      .subscribe(
        (createdOrder) => {
          console.log('Commande créée avec succès :', createdOrder);
          Swal.fire({
            icon: 'success',
            title: 'Commande passée avec succès',
            showConfirmButton: false,
            timer: 1500
          }); 
          localStorage.removeItem('selectedProduitId'); 
        },
        (error) => {
          console.error('Erreur lors de la création de la commande :', error);
        }
      );
  }

  onSelectPDF(event: any): void {
    const files: FileList = event?.target?.files; // Utilise `event.target.files` pour obtenir les fichiers sélectionnés
  
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file) {
          this.order.pdf.push(file); // Ajouter le fichier PDF à la liste des PDF de la commande
        }
      }
    }
  
    console.log('Fichiers PDF sélectionnés :', this.order.pdf); // Assurez-vous que les fichiers PDF sont ajoutés à `this.order.pdf`
  }
  


getImageUrl(imageName: string): string {
  return `http://localhost:9090/img/${imageName}`;
}

proceedToCheckout(): void {
  if (!this.isLoggedIn) {
    Swal.fire({
      icon: 'error',
      title: 'Vous êtes déconnecté',
      showConfirmButton: false,
      timer: 1500
    });
    const returnUrl = this.router.url; // Récupère l'URL actuelle
    this.router.navigate(['/signin'], { queryParams: { returnUrl } });
  }
}

monnaieKeys(): string[] {
  return Object.values(Monnaie);
}


}
