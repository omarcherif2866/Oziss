import { Component, OnInit } from '@angular/core';
import { ProduitService } from '../../services/produit.service';
import { ServiceService } from '../../services/service.service';
import { Produit } from '../../models/produit';
import { Service } from '../../models/service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { User } from '../../models/user';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  produits: Produit[] = [];
  services: Service[] = [];
  Users: User[] = [];

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


  constructor(    private productService: ProduitService,
    private serviceService: ServiceService,private router: Router,
    private userService: AuthService) { }

  ngOnInit(): void {
    this.getAllServices();
    this.getAllProducts();
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

    getImageUrl(imageName?: string): string {
      if (imageName && !imageName.startsWith('assets/')) {
        // Si l'image provient de la base de données, on utilise une URL spécifique
        return `${imageName}`;
      }
      // Sinon, elle est dans les assets (statique)
      return imageName ? imageName : 'assets/img/default-image.png';
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
