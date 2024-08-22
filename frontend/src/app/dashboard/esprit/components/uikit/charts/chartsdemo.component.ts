import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from 'src/app/dashboard/layout/service/app.layout.service';
import { OrderService } from '../../../service/order.service';
import { UserService } from '../../../service/user.service';
import { ProduitService } from '../../../service/produit.service';

@Component({
    templateUrl: './chartsdemo.component.html'
})
export class ChartsDemoComponent implements OnInit, OnDestroy {

    clientId: string = '';

    doughnutData: any;

    doughnutOptions: any;

    lineData: any;

    barData: any;

    pieData: any;

    polarData: any;

    radarData: any;

    lineOptions: any;

    barOptions: any;

    pieOptions: any;

    polarOptions: any;

    radarOptions: any;

    errorMessage: string | null = null;

    productCount: number | null = null;

    productsData!: any[];

    clients: any[] = []; // Exemple de propriété

    userRole: string | null = null;


    subscription: Subscription;
    constructor(private layoutService: LayoutService, private orderService: OrderService,
        private userService: UserService, private produitService: ProduitService
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
        this.loadProductsByService();
        this.getTopSellingProducts();
        this.loadClientBudgets()
    }

    initCharts() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        
        this.barData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'My First dataset',
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    borderColor: documentStyle.getPropertyValue('--primary-500'),
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: 'My Second dataset',
                    backgroundColor: documentStyle.getPropertyValue('--primary-200'),
                    borderColor: documentStyle.getPropertyValue('--primary-200'),
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        };

        this.barOptions = {
            plugins: {
                legend: {
                    labels: {
                        fontColor: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
            }
        };

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

        this.lineData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    borderColor: documentStyle.getPropertyValue('--primary-500'),
                    tension: .4
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--primary-200'),
                    borderColor: documentStyle.getPropertyValue('--primary-200'),
                    tension: .4
                }
            ]
        };

        this.lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        fontColor: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
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

        this.radarData = {
            labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
            datasets: [
                {
                    label: 'My First dataset',
                    borderColor: documentStyle.getPropertyValue('--indigo-400'),
                    pointBackgroundColor: documentStyle.getPropertyValue('--indigo-400'),
                    pointBorderColor: documentStyle.getPropertyValue('--indigo-400'),
                    pointHoverBackgroundColor: textColor,
                    pointHoverBorderColor: documentStyle.getPropertyValue('--indigo-400'),
                    data: [65, 59, 90, 81, 56, 55, 40]
                },
                {
                    label: 'My Second dataset',
                    borderColor: documentStyle.getPropertyValue('--purple-400'),
                    pointBackgroundColor: documentStyle.getPropertyValue('--purple-400'),
                    pointBorderColor: documentStyle.getPropertyValue('--purple-400'),
                    pointHoverBackgroundColor: textColor,
                    pointHoverBorderColor: documentStyle.getPropertyValue('--purple-400'),
                    data: [28, 48, 40, 19, 96, 27, 100]
                }
            ]
        };

        this.radarOptions = {
            plugins: {
                legend: {
                    labels: {
                        fontColor: textColor
                    }
                }
            },
            scales: {
                r: {
                    grid: {
                        color: textColorSecondary
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
              labels.push(`${order.status}: ${order.produits.map((p: any) => p.produit).join(', ')}`); // Affichage du statut avec les noms des produits
              datasetData.push(order.total); // Total des produits pour chaque statut
    
              // Ajouter la couleur correspondante à chaque statut
              backgroundColor.push(statusColors[order.status] || '#FFFFFF'); // Utiliser une couleur par défaut si le statut n'est pas défini
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
              plugins: {
                legend: {
                  position: 'top',
                },
                tooltip: {
                  callbacks: {
                    label: (context: any) => {
                      let label = context.label || '';
                      if (label) {
                        label += ': ' + context.raw + ' commandes';
                      }
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
            labels: data.map(item => item.produitDetails.nom), // Noms des produits
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
