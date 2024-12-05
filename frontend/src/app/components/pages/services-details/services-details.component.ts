import { Component, OnInit } from '@angular/core';
import { Service } from '../../models/service';
import { ActivatedRoute } from '@angular/router';
import { ServiceService } from '../../services/service.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { User } from 'src/app/dashboard/esprit/models/user';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-services-details',
  templateUrl: './services-details.component.html',
  styleUrls: ['./services-details.component.scss']
})
export class ServicesDetailsComponent implements OnInit {

  service: Service | undefined;
  isImageOnLeft: boolean = true; // Détermine si l'image est à gauche ou à droite
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
  constructor(
    private route: ActivatedRoute,
    private serviceService: ServiceService,
    private userService: AuthService
  ) { }

  ngOnInit(): void {
    const serviceId = this.route.snapshot.params['id'];
    this.getServiceDetails(serviceId);

    this.getAllPartners()
  }

  partnerSlides: OwlOptions = {
		loop: true,
		nav: false,
		dots: false,
		autoplayHoverPause: true,
		autoplay: true,
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
    }

//   getImageUrl(imageName?: string): string {
//     return imageName ? `http://localhost:9090/img/${imageName}` : '';
// }

  getServiceDetails(serviceId: string): void {
    this.serviceService.getServiceById(serviceId).subscribe(service => {
      this.service = service;
      console.log("Détails du service récupéré :", service);
      this.isImageOnLeft = Math.random() > 0.5;

    });
  }

  getImageUrl(imageName?: string): string {
    if (imageName && !imageName.startsWith('assets/')) {
      // Si l'image provient de la base de données, on utilise une URL spécifique
      return `${imageName}`;
    }
    // Sinon, elle est dans les assets (statique)
    return imageName ? imageName : '';
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
