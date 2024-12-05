import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from 'src/app/dashboard/layout/service/app.layout.service';
import { OrderService } from '../../../service/order.service';
import { UserService } from '../../../service/user.service';
import { ProduitService } from '../../../service/produit.service';
import { ServiceService } from '../../../service/service.service';

@Component({
    templateUrl: './chartsdemo.component.html',
    styleUrl: './chartsdemo.component.scss'

})
export class ChartsDemoComponent implements OnInit, OnDestroy {
    isSmallScreen = window.innerWidth < 768;


    
    clientId: string = '';

    doughnutData: any;

    doughnutOptions: any;

    lineData: any;

    barData: any;

    pieData: any;

    polarData: any;

    lineOptions: any;

    barOptions: any;

    pieOptions: any;

    polarOptions: any;

    radarOptions: any;

    errorMessage: string | null = null;

    productCount: number | null = null;

    serviceCount: number | null = null;

    clientCount: number | null = null;

    partnerCount: number | null = null;

    productsData!: any[];

    clients: any[] = []; // Exemple de propriété

    userRole: string | null = null;


    subscription: Subscription;
    constructor(private layoutService: LayoutService, private orderService: OrderService,
        private userService: UserService, private produitService: ProduitService
        , private serviceService: ServiceService
    ) {
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe((config) => {
                this.initCharts();
            });
    }

    ngOnInit() {
        this.clientId = localStorage.getItem('user_id') || ''; // Assurez-vous que l'ID du client est stocké dans localStorage
        if (this.clientId) {
          this.loadOrdersByStatus();
        } else {
          console.error('Client ID not found in localStorage');
        }

        this.userRole = localStorage.getItem('userRole');


        // this.initCharts();
        this.loadOrdersByStatus();
        this.loadUserCounts();
        this.loadProductCount();
        this.loadServiceCount();
        this.loadProductsByService();
        this.getTopSellingProducts();
        this.loadClientBudgets()
        this.initializeCharts();
        this.initializeClients();

    }


    initializeCharts() {
        // Initialisation des données et options pour les graphiques
        this.lineData = { /* vos données pour le graphique en ligne */ };
        this.lineOptions = { responsive: true, maintainAspectRatio: false };
        this.pieData = { /* vos données pour le graphique en secteur */ };
        this.pieOptions = { responsive: true, maintainAspectRatio: false };
      }

      initializeClients() {
        // Initialisation des données et options pour les graphiques
        this.lineData = { /* vos données pour le graphique en ligne */ };
        this.lineOptions = { responsive: true, maintainAspectRatio: false };
        this.pieData = { /* vos données pour le graphique en secteur */ };
        this.pieOptions = { responsive: true, maintainAspectRatio: false };
      }

    initCharts() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        

      

        this.pieData = {
            labels: ['A', 'B', 'C'],
            datasets: [
                {
                    data: [540, 325, 702],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--indigo-500'),
                        documentStyle.getPropertyValue('--purple-500'),
                        documentStyle.getPropertyValue('--teal-500')
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--indigo-400'),
                        documentStyle.getPropertyValue('--purple-400'),
                        documentStyle.getPropertyValue('--teal-400')
                    ]
                }]
        };

        this.pieOptions = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        };


        this.polarData = {
            datasets: [{
                data: [
                    11,
                    16,
                    7,
                    3
                ],
                backgroundColor: [
                    documentStyle.getPropertyValue('--indigo-500'),
                    documentStyle.getPropertyValue('--purple-500'),
                    documentStyle.getPropertyValue('--teal-500'),
                    documentStyle.getPropertyValue('--orange-500')
                ],
                label: 'My dataset'
            }],
            labels: [
                'Indigo',
                'Purple',
                'Teal',
                'Orange'
            ]
        };

        this.polarOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                r: {
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };

    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    loadOrdersByStatus() {
      this.orderService.getOrdersByStatus(this.clientId)
        .subscribe((data: any[]) => {
          // Définir les couleurs en fonction des statuts
          const statusColors: { [key: string]: string } = {
            'En attente': '#FF6384',  // Couleur pour 'En attente'
            'Confirmée': '#36A2EB',   // Couleur pour 'Confirmée'
            'Expédiée': '#FFCE56',    // Couleur pour 'Expédiée'
            'Livrée': '#E7E9ED',      // Couleur pour 'Livrée'
            'Annulée': '#C9CBCF'      // Couleur pour 'Annulée'
          };
  
          // Initialisation des labels et des données pour le graphique
          const labels: string[] = [];
          const datasetData: number[] = [];
          const backgroundColor: string[] = [];
  
          // Transformation des données pour le graphique
          data.forEach(order => {
            // Pour chaque produit dans la commande, ajouter une entrée dans les labels
            order.produits.forEach((produit: any) => {
              labels.push(`${order.status}: ${produit.produit}`); // Affichage du statut avec le nom du produit
              datasetData.push(order.total); // Total des produits pour chaque statut
  
              // Ajouter la couleur correspondante à chaque statut
              backgroundColor.push(statusColors[order.status] || '#FFFFFF'); // Utiliser une couleur par défaut si le statut n'est pas défini
            });
          });
  
          this.doughnutData = {
            labels: labels,
            datasets: [{
              data: datasetData,
              backgroundColor: backgroundColor
            }]
          };
  
          this.doughnutOptions = {
            responsive: true,
            cutout: '40%', // Modifiez ce pourcentage pour ajuster la taille du trou
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  boxWidth: 60, // Largeur de la case de couleur à gauche de chaque label
                  boxHeight: 10, // Hauteur de la case de couleur
                  boxPadding: 5, // Espace entre la case de couleur et le texte du label
                  font: {
                    size: 10, // Taille de la police des légendes
                  }
                }
              },
              tooltip: {
                callbacks: {
                  label: (context: any) => {
                    let label = context.label || '';
                    return label;
                  }
                }
              }
            }
          };
          
  
          console.log('Doughnut Data:', this.doughnutData); // Vérifiez que les données sont correctes
          console.log('Doughnut Options:', this.doughnutOptions); // Vérifiez que les options sont correctes
        }, error => {
          console.error('Error loading orders by status:', error);
        });
  }
  

    loadUserCounts() {
        this.userService.getUserCounts().subscribe(
          data => {
            this.pieData = {
              labels: ['Clients', 'Partenaires'],
              datasets: [
                {
                  data: [data.clientCount, data.partnerCount],
                  backgroundColor: ['#42A5F5', '#66BB6A'],
                  hoverBackgroundColor: ['#64B5F6', '#81C784']
                }
              ]
            };
    
            this.pieOptions = {
              responsive: true,
              maintainAspectRatio: false
            };
            this.clientCount = data.clientCount;
            this.partnerCount = data.partnerCount;
          },
          error => {
            console.error('Error fetching user counts:', error);
            this.errorMessage = 'Error fetching user counts. Please try again later.';
          }
        );
    }

    loadProductCount() {
        this.produitService.getProductCount().subscribe(
          data => {
            this.productCount = data.productCount;
          },
          error => {
            console.error('Error fetching product count:', error);
            this.errorMessage = 'Error fetching product count. Please try again later.';
          }
        );
      }

    loadServiceCount() {
        this.serviceService.getServiceCount().subscribe(
          data => {
            this.serviceCount = data.serviceCount;
          },
          error => {
            console.error('Error fetching service count:', error);
            this.errorMessage = 'Error fetching service count. Please try again later.';
          }
        );
      }
    
    loadProductsByService(): void {
        this.produitService.getProductsByService().subscribe((data: any[]) => {
            // Formatage des données pour le Bar Chart
            if (data && data.length > 0) {
              this.productsData = data.map(item => ({
                service: item._id,
                count: item.products.length // Compte le nombre de produits pour chaque service
              }));
          
              // Préparation des données pour le Bar Chart
              this.barData = {
                labels: this.productsData.map(item => item.service), // Les noms des services
                datasets: [
                  {
                    label: 'Nombre de Produits',
                    backgroundColor: '#42A5F5',
                    data: this.productsData.map(item => item.count), // Nombre de produits pour chaque service
                  }
                ]
              };
          
              // Options du Bar Chart
              this.barOptions = {
                responsive: true,
                legend: {
                  position: 'top',
                },
                scales: {
                  xAxes: [{
                    ticks: {
                      autoSkip: false
                    }
                  }],
                  yAxes: [{
                    ticks: {
                      beginAtZero: true,
                    }
                  }]
                }
              };
            }
          });
      }
    
    getTopSellingProducts() {
        this.produitService.getTopSellingProducts().subscribe((data: any[]) => {
            console.log(data); // Ajoutez ceci pour voir les données dans la console

            if (data && data.length > 0) {
            // Préparer les données pour le Line Chart
            this.lineData = {
            labels: data.map(item => item.produitDetails.nom), 
            datasets: [
                {
                label: 'Nombre de Commandes',
                borderColor: '#42A5F5',
                backgroundColor: 'rgba(66, 165, 245, 0.2)',
                data: data.map(item => item.count), // Nombre de commandes pour chaque produit
                fill: true,
                cubicInterpolationMode: 'monotone', // Rend la courbe lissée
                }
            ]
            };

            this.lineOptions = {
              responsive: true,
              legend: {
                position: 'top',
              },
              scales: {
                x: {
                  ticks: {
                      display: false, // Désactiver l'affichage des labels sur l'axe x
                      autoSkip: false
                  },
                  grid: {
                      display: false // Désactiver l'affichage de la grille si souhaité
                  }
              },
                yAxes: [{
                  ticks: {
                    beginAtZero: true,
                  }
                }]
              }
            };
        }
        });
    }


    loadClientBudgets() {
        this.userService.getClientBudgets().subscribe(
        (data: { name: string, budget: number }[]) => {
            this.clients = data;
        },
        error => {
            console.error('Error fetching client budgets:', error);
        }
        );
    }
}
