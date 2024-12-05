import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ServiceService } from '../../services/service.service';
import { Service } from '../../models/service';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../models/user';
import { Actualite } from 'src/app/dashboard/esprit/models/actualite';
import { ActualiteService } from 'src/app/dashboard/esprit/service/actualite.service';
import { Temoignage } from 'src/app/dashboard/esprit/models/temoignage';
import { TemoignageService } from 'src/app/dashboard/esprit/service/temoignage.service';

@Component({
    selector: 'app-pc-repair-demo',
    templateUrl: './pc-repair-demo.component.html',
    styleUrls: ['./pc-repair-demo.component.scss']
})
export class PcRepairDemoComponent implements OnInit {
    services: Service[] = [];
    Users: User[] = [];
    actualites: Actualite[] = [];
    temoignages: Temoignage[] = []; // Initialisez le tableau ici

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


    
    constructor(private serviceService: ServiceService,    private userService: AuthService,
      private actualiteService: ActualiteService,private temoignageService: TemoignageService
    ) { }

    ngOnInit(): void {
        this.getAllServices()
        this.getAllPartners()
        this.getLastThreeActualites()
        this.getTemoignages();
        this.loadImagesFromLocalStorage();
    }

  //   private loadImagesFromLocalStorage(): void {
  //       const storedImages = JSON.parse(localStorage.getItem('bannerImages') || '[]');
        
  //       // Chargement des images stockées
  //       storedImages.forEach((image: string) => {
  //           const newBannerItem = {
  //               bgImg: this.getImageUrl(image), // Utilise ta méthode pour obtenir l'URL si nécessaire
  //               subTitle: '',
  //               title: 'Titre par défaut',
  //               desc: 'Description par défaut',
  //           };

  //           // Ajoute l'image en deuxième position
  //           this.agencyPortfolioMainBanner.splice(1, 0, newBannerItem);

  //           // Supprime le dernier élément pour garder le nombre d'images à 4
  //           if (this.agencyPortfolioMainBanner.length > 4) {
  //               this.agencyPortfolioMainBanner.pop();
  //           }
  //       });
  //   }

  //   addImageToBanner(image: any): void {
  //     const newBannerItem = {
  //         bgImg: this.getImageUrl(image.image), // Utilise ta méthode pour obtenir l'URL si nécessaire
  //         subTitle: '',
  //         title: 'Titre par défaut',
  //         desc: 'Description par défaut',
  //     };

  //     // Ajoute l'image en deuxième position
  //     this.agencyPortfolioMainBanner.splice(1, 0, newBannerItem);

  //     // Supprime le dernier élément pour garder le nombre d'images à 4
  //     if (this.agencyPortfolioMainBanner.length > 4) {
  //         this.agencyPortfolioMainBanner.pop();
  //     }
  // }

  private loadImagesFromLocalStorage(): void {
    const storedImages = JSON.parse(localStorage.getItem('bannerImages') || '[]');
    
    // Load stored images with their titles and subtitles
    storedImages.forEach((image: any) => {
        const newBannerItem = {
            bgImg: this.getImageUrl(image.image), // Use your method to get the URL if needed
            title: image.titre || 'Titre par défaut',  // Use titre for title
            desc: image.sousTitre || 'Description par défaut', // Use sousTitre for desc
        };

        // Add the image in the second position
        this.agencyPortfolioMainBanner.splice(1, 0, newBannerItem);

        // Remove the last item to keep the number of images at 4
        if (this.agencyPortfolioMainBanner.length > 4) {
            this.agencyPortfolioMainBanner.pop();
        }
    });
}



	agencyPortfolioMainBanner = [
        {
            bgImg: `assets/img/agency-portfolio-main-banner/banner02-01.png`,
			subTitle: '',
            // `We are Agency`,
			title: 'Boostez Votre Croissance avec Nos Solutions IT Innovantes pour le Marché Africain',
            // `Bienvenue Chez OZISS COOPERATION`,
			desc: '',
            // `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.`,
        },
        {
            bgImg: `assets/img/agency-portfolio-main-banner/banner02.jpg`,
},
        {
            bgImg: `assets/img/agency-portfolio-main-banner/banner03.jpg`,
},
        {
            bgImg: `assets/img/agency-portfolio-main-banner/banner05.jpg`,

        }
    ]

    homeSlides: any = {
      loop: true,
      autoplay: true,
      autoplayTimeout: 2000,
      autoplayHoverPause: true,
      nav: false,
      responsive: {
          0: {
              items: 1,
              nav: false
          },
          600: {
              items: 1,
              nav: false
          },
          1000: {
              items: 1,
              nav: false
          }
      }
  };
  
  
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
      };

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

// getImageUrl(imageName?: string): string {
//     // Vérifiez si l'image existe dans le répertoire backend
//     const imageUrl = imageName ? `http://localhost:9090/img/${imageName}` : 'assets/img/default-image.png';
//     return imageUrl;
// }

getImageUrl(imageName?: string): string {
  if (imageName && !imageName.startsWith('assets/')) {
    // Si l'image provient de la base de données, on utilise une URL spécifique
    return `${imageName}`;
  }
  // Sinon, elle est dans les assets (statique)
  return imageName ? imageName : '';
}

      
getAllServices(): void {
    this.serviceService.getService().subscribe(ss => {
      this.services = ss;
      console.log("services récupérées:", ss);
    });
  }

  // getAllPartners(): void {
  //   this.userService.getUser().subscribe(ss => {
  //     // Afficher les utilisateurs récupérés dans la console
  //     console.log("Users récupérées:", ss);
      
  //     // Filtrer les utilisateurs pour ne garder que ceux avec userType = 'client'
  //     this.Users = ss.filter(user => user.userType === 'partner');
      
  //     // Afficher les utilisateurs filtrés dans la console pour vérification
  //     console.log("Partners filtrés:", this.Users);
  //   }, error => {
  //     // Gestion des erreurs
  //     console.error("Erreur lors de la récupération des utilisateurs:", error);
  //   });
  // }


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

  getLastThreeActualites(): void {
    this.actualiteService.getLastThreeActualites().subscribe(
      (data) => {
        this.actualites = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des actualités : ', error);
      }
    );
  }

  
  getTemoignages(): void {
    this.temoignageService.getTemoignage().subscribe(
        (data: Temoignage[]) => {
            this.temoignages = data.filter(t => t.createur);
            this.temoignages.forEach(temoignage => {
                // Récupérez les détails du créateur
                this.userService.getUserProfile(temoignage.createur).subscribe(
                    (user: User) => {
                        // Assignez l'objet utilisateur au témoignage
                        temoignage.createur = user;
                    },
                    (error) => {
                        console.error('Erreur lors de la récupération de l\'utilisateur', error);
                    }
                );
            });
        },
        (error) => {
            console.error('Erreur lors de la récupération des témoignages', error);
        }
    );
}


  
}