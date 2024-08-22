import { Component, OnInit } from '@angular/core';
import { ProduitService } from '../../services/produit.service';
import { ServiceService } from '../../services/service.service';
import { Produit } from '../../models/produit';
import { Service } from '../../models/service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  produits: Produit[] = [];

  services: Service[] = [];



  constructor(    private productService: ProduitService,
    private serviceService: ServiceService,private router: Router) { }

  ngOnInit(): void {
    this.getAllServices();
    this.getAllProducts();

  }


  getAllServices(): void {
    this.serviceService.getService().subscribe(ss => {
      this.services = ss;
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

    getImageUrl(imageName: string): string {
      return `http://localhost:9090/img/${imageName}`;
    }

    addToCart(produit: Produit) {
      localStorage.setItem('selectedProduitId', produit._id); // Sauvegarde uniquement l'ID du produit
      this.router.navigate(['/checkout'], {
        queryParams: {
          nomProduit: produit.nom,
          description: produit.description,
          imageProduit: produit.image
        }
      });
    }
    


}
