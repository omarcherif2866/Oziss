import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ServiceService } from '../../services/service.service';
import { Service } from '../../models/service';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../models/user';

@Component({
    selector: 'app-pc-repair-demo',
    templateUrl: './pc-repair-demo.component.html',
    styleUrls: ['./pc-repair-demo.component.scss']
})
export class PcRepairDemoComponent implements OnInit {
    services: Service[] = [];
    Users: User[] = [];

    constructor(private serviceService: ServiceService,    private userService: AuthService,
    ) { }

    ngOnInit(): void {
        this.getAllServices()
        this.getAllPartners()

    }

	agencyPortfolioMainBanner = [
        {
            bgImg: `assets/img/agency-portfolio-main-banner/banner02-01.png`,
			subTitle: '',
            // `We are Agency`,
			title: '',
            // `Bienvenue Chez OZISS COOPERATION`,
			desc: '',
            // `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.`,
        },
        {
            bgImg: `assets/img/agency-portfolio-main-banner/img2.jpg`,
			title: `Community Management`,
			desc: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.`,
        },
        {
            bgImg: `assets/img/agency-portfolio-main-banner/img3.jpg`,
			title: `Data Analyse`,
			desc: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.`,
        },
        {
            bgImg: `assets/img/agency-portfolio-main-banner/img3.jpg`,
			title: `Votre Site WEB Sur Mesure`,
			desc: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.`,
        }
    ]
        homeSlides: OwlOptions = {
		loop: true,
		nav: true,
		smartSpeed: 1000,
		autoplayTimeout: 5000,
		dots: false,
		animateOut: 'fadeOut',
		autoplayHoverPause: true,
		autoplay: true,
		items: 1,
		navText: [
			"<i class='bx bx-chevron-left'></i>",
			"<i class='bx bx-chevron-right'></i>"
		]
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
    
    feedbackSlides: OwlOptions = {
		loop: true,
		nav: false,
		dots: true,
		autoplayHoverPause: true,
		autoplay: true,
		margin: 30,
		items: 1
    }

    // Services Content
    singleRepairServices = [
        {
            bgImg: `assets/img/repair-services-img/1.jpg`,
            icon: `flaticon-monitor`,
            title: `Laptop Repair`,
            desc: `Lorem ipsum eiusmod dolor sit amet elit, adipiscing, sed do eiusmod tempor incididunt ut labore dolore magna aliqua.`,
            link: `services-details`
        },
        {
            bgImg: `assets/img/repair-services-img/2.jpg`,
            icon: `flaticon-idea`,
            title: `Computer Repair`,
            desc: `Lorem ipsum eiusmod dolor sit amet elit, adipiscing, sed do eiusmod tempor incididunt ut labore dolore magna aliqua.`,
            link: `services-details`
        },
        {
            bgImg: `assets/img/repair-services-img/3.jpg`,
            icon: `flaticon-layout`,
            title: `Apple Products Repair`,
            desc: `Lorem ipsum eiusmod dolor sit amet elit, adipiscing, sed do eiusmod tempor incididunt ut labore dolore magna aliqua.`,
            link: `services-details`
        },
        {
            bgImg: `assets/img/repair-services-img/4.jpg`,
            icon: `flaticon-update-arrows`,
            title: `Software Update`,
            desc: `Lorem ipsum eiusmod dolor sit amet elit, adipiscing, sed do eiusmod tempor incididunt ut labore dolore magna aliqua.`,
            link: `services-details`
        },
        {
            bgImg: `assets/img/repair-services-img/5.jpg`,
            icon: `flaticon-smartphone`,
            title: `Smartphone Repair`,
            desc: `Lorem ipsum eiusmod dolor sit amet elit, adipiscing, sed do eiusmod tempor incididunt ut labore dolore magna aliqua.`,
            link: `services-details`
        },
        {
            bgImg: `assets/img/repair-services-img/6.jpg`,
            icon: `flaticon-hard-disk`,
            title: `Data Backup & Recovery`,
            desc: `Lorem ipsum eiusmod dolor sit amet elit, adipiscing, sed do eiusmod tempor incididunt ut labore dolore magna aliqua.`,
            link: `services-details`
        }
    ]

getImageUrl(imageName?: string): string {
    // Vérifiez si l'image existe dans le répertoire backend
    const imageUrl = imageName ? `http://localhost:9090/img/${imageName}` : 'assets/img/default-image.png';
    return imageUrl;
}


      
getAllServices(): void {
    this.serviceService.getService().subscribe(ss => {
      this.services = ss;
      console.log("services récupérées:", ss);
    });
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