import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Produit } from '../../models/produit';
import { ActivatedRoute, Router } from '@angular/router';
import { ProduitService } from '../../services/produit.service';
import { Service } from '../../models/service';
import { ServiceService } from '../../services/service.service';
import { User } from 'src/app/dashboard/esprit/models/user';
import { AuthService } from '../../services/auth/auth.service';

@Component({
    selector: 'app-products-details',
    templateUrl: './products-details.component.html',
    styleUrls: ['./products-details.component.scss']
})
export class ProductsDetailsComponent implements OnInit {

    produit: Produit | undefined;
    services: Service[] = [];
    serviceName!: string;
    Users: User[] = [];
    produits: Produit[] = [];

    staticPartners = [
      {
        nom: 'IBM',
        image: 'assets/img/partner-img/ibm.png',
        url: 'https://www.partner1.com'
      },
      {
        nom: 'Microsoft',
        image: 'assets/img/partner-img/microsoft.jpg',
        url: 'https://www.partner2.com'
      },
      {
        nom: 'Amazon Web Services (AWS)',
        image: 'assets/img/partner-img/aws.jpg',
        url: 'https://www.partner3.com'
      },
      {
        nom: 'Oracle',
        image: 'assets/img/partner-img/oracle.png',
        url: 'https://www.partner3.com'
      },
      
      ];
    
      allPartners: any[] = [];
    constructor(
      private route: ActivatedRoute,
      private produitService: ProduitService,
      private router: Router,
      private serviceService: ServiceService,
      private userService: AuthService
    ) { }
  
    ngOnInit(): void {
      const produitId = this.route.snapshot.params['id'];
      this.getProduitDetails(produitId);
      this.getAllPartners()

    }
    
    partnerSlides: OwlOptions = {
      loop: true,
      nav: false,
      dots: false,
      autoplay: true, // Active l'autoplay
      autoplayTimeout: 2000, // Temps entre les diapositives (en ms)
      autoplayHoverPause: true, // Pause l'autoplay lors du survol
      margin: 30,
      responsive: {
        0: {
          items: 2
        },
        576: {
          items: 4
        },
        768: {
          items: 4
        },
        992: {
          items: 6
        }
      }
    };
  
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

    
      getImageUrl(imageName?: string): string {
        if (imageName && !imageName.startsWith('assets/')) {
          // Si l'image provient de la base de données, on utilise une URL spécifique
          return `${imageName}`;
        }
        // Sinon, elle est dans les assets (statique)
        return imageName ? imageName : 'assets/img/default-image.png';
      }

      getAllPartners(): void {
        this.userService.getUser().subscribe(ss => {
          // Afficher les utilisateurs récupérés dans la console
          console.log("Users récupérés:", ss);
    
          // Filtrer les utilisateurs pour ne garder que ceux avec userType = 'partner'
          this.Users = ss.filter(user => user.userType === 'partner');
    
          // Combiner les partenaires récupérés dynamiquement avec les partenaires statiques
          this.allPartners = [...this.Users, ...this.staticPartners];
    
          // Afficher la liste complète des partenaires
          console.log("Tous les partenaires:", this.allPartners);
    
        }, error => {
          console.error("Erreur lors de la récupération des utilisateurs:", error);
        });
      }
    
    

}