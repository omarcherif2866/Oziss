import { Component, OnInit } from '@angular/core';
import { Service } from '../../models/service';
import { ServiceService } from '../../services/service.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

  services: Service[] = [];
  Users: User[] = [];

  constructor(private serviceService: ServiceService,    private userService: AuthService,
  ) { }

  ngOnInit(): void {
	  this.getAllServices()
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

getImageUrl(imageName?: string): string {
    // Vérifiez si l'image existe dans le répertoire backend
    const imageUrl = imageName ? `http://localhost:9090/img/${imageName}` : 'assets/img/default-image.png';
    return imageUrl;
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

}
