import { Component } from '@angular/core';
import { Monnaie, Order } from '../../models/order';
import { OrderService } from '../../service/order.service';
import { forkJoin, tap } from 'rxjs';
import { ProduitService } from '../../service/produit.service';
import { UserService } from '../../service/user.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {
  orders: Order[] = [];
  selectedOrders: Order[] = [];
  selectedStatuses: { [key: string]: string } = {}; // Tableau pour stocker les statuts sélectionnés par commande
  cols: any[];
  statusOptions: any[] = [
    { label: 'Annulée', value: 'Annulée' },
    { label: 'En attente', value: 'En attente' },
    { label: 'Confirmée', value: 'Confirmée' },
    { label: 'Expédiée', value: 'Expédiée' },
    { label: 'Livrée', value: 'Livrée' },


    // Ajoutez d'autres options de statut au besoin
  ];
  constructor(private orderService: OrderService, private produitService: ProduitService, private userService: UserService,
    private messageService: MessageService // Injecter le service de message

  ) {
    this.cols = [
      { field: 'client.nom', header: 'Nom du client' },
      { field: 'client.email', header: 'Email du client' },
      { field: 'client.phoneNumber', header: 'Numéro du téléphone' },
      { field: 'produits.produit.nom', header: 'Nom du produit' },
      { field: 'status', header: 'Statut' },
      { header: 'Modifier commande' }


    ];
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  onStatusChange(order: Order, event: any) {
    const newStatus = event.value;
    this.orderService.updateOrderStatus(order._id, newStatus).subscribe(
      (updatedOrder: Order) => {
        // Mettre à jour le statut dans la liste affichée
        const index = this.orders.findIndex(o => o._id === updatedOrder._id);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
          this.selectedStatuses[updatedOrder._id] = updatedOrder.status; // Mettre à jour le statut sélectionné
          this.showMessage('success', 'Succès', 'Statut modifié');

        }
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du statut de la commande :', error);
        this.showMessage('error', 'Erreur', 'Erreur lors de la mise à jour du statut');
      }
    );
  }
  

  

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe(
      (orders: Order[]) => {
        orders.forEach(order => {
          this.selectedStatuses[order._id] = order.status; // Initialiser selectedStatuses avec le statut actuel
        });

        const produitRequests = orders.flatMap((order:any) =>
          order.produits.map((produitItem:any) =>
            this.produitService.getProductById(produitItem.produit).pipe(
              tap(produit => produitItem.produit = produit)
            )
          )
        );

        const clientRequests = orders.map(order =>
          this.userService.getUserProfile(order.client).pipe(
            tap(client => order.client = client)
          )
        );

        forkJoin([...produitRequests, ...clientRequests]).subscribe(() => {
          this.orders = orders;
          console.log('orders :', orders);
        });
      },
      (error) => {
        console.error('Erreur lors de la récupération des commandes :', error);
      }
    );
  }

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  // updateOrderStatus(orderId: string, status: string): void {
  //   this.orderService.updateOrderStatus(orderId, status).subscribe(
  //     (updatedOrder: Order) => {
  //       // Mettre à jour la commande dans la liste affichée
  //       const index = this.orders.findIndex(order => order._id === updatedOrder._id);
  //       if (index !== -1) {
  //         this.orders[index] = updatedOrder;
  //       }
  //     },
  //     (error) => {
  //       console.error('Erreur lors de la mise à jour du statut de la commande :', error);
  //       // Gérer les erreurs ou afficher un message à l'utilisateur
  //     }
  //   );
  // }

  private showMessage(severity: string, summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail, life: 3000 });
  }

  getMonnaieSymbol(order: Order): string {
    if (!order || order.monnaie === undefined) {
      return ''; // Retourne une chaîne vide si `order` ou `order.monnaie` est undefined
    }
  
    switch (order.monnaie) {
      case Monnaie.Euro:
        return '€';
      case Monnaie.Dollar:
        return '$';
      case Monnaie.DinarTunisien:
        return 'DT';
      case Monnaie.FrancCFA_CEMAC:
        return 'XAF';
      case Monnaie.FrancGuineen:
        return 'GNF';
      case Monnaie.FrancCFA_UEMOA:
        return 'XOF';
      default:
        return ''; // Retourne une chaîne vide si la monnaie ne correspond à aucun des cas
    }
  }

}