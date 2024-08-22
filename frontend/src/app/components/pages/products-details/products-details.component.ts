import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Produit } from '../../models/produit';
import { ActivatedRoute } from '@angular/router';
import { ProduitService } from '../../services/produit.service';
import { Service } from '../../models/service';
import { ServiceService } from '../../services/service.service';

@Component({
    selector: 'app-products-details',
    templateUrl: './products-details.component.html',
    styleUrls: ['./products-details.component.scss']
})
export class ProductsDetailsComponent implements OnInit {

    produit: Produit | undefined;
    services: Service[] = [];
    serviceName!: string;

    constructor(
      private route: ActivatedRoute,
      private produitService: ProduitService,
      private serviceService: ServiceService
    ) { }
  
    ngOnInit(): void {
      const produitId = this.route.snapshot.params['id'];
      this.getProduitDetails(produitId);
    }
  
    getProduitDetails(produitId: string): void {
        this.produitService.getProductById(produitId).subscribe(
          produit => {
            this.produit = produit;
            console.log("Détails du produit récupéré :", produit);
            this.getServiceName(produit.service); // Passer l'ID du service ici
        },
          error => {
            console.error("Erreur lors de la récupération du produit :", error);
          }
        );
      }
    
      getServiceName(serviceId: any): void {
        this.serviceService.getServiceById(serviceId).subscribe(
          service => {
            if (service && service.nom) {
              this.serviceName = service.nom; // Assigner seulement si service.nom est défini
            } else {
              this.serviceName = 'Nom du service non trouvé'; // Ou une valeur par défaut appropriée
            }
            console.log("Service du produit :", this.serviceName);
          },
          error => {
            console.error("Erreur lors de la récupération du service :", error);
          }
        );
      }
      

    
    getImageUrl(imageName: string): string {
        return `http://localhost:9090/img/${imageName}`;
      }


    
    

}