import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../models/order';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  // createOrder(clientId: string, produits: Produit[]): Observable<Order> {
  //   const body = { clientId, produits };
  //   return this.http.post<any>("http://localhost:9090/commande/orders", body);
  // }

  createOrder(order: any): Observable<Order> {
    return this.http.post<Order>("http://localhost:9090/commande/orders", order);
  }

  getAllOrders() {
    return this.http.get<Order[]>("http://localhost:9090/commande/allOrders");
  }

  getOrderByClient(clientId:string) {
    return this.http.get<Order[]>("http://localhost:9090/commande/orders/client/"+clientId);
  }

  updateOrderStatus(orderId: string, status: string): Observable<Order> {
    const url = `http://localhost:9090/commande/order/status/${orderId}`;
    return this.http.put<Order>(url, { status });
  }
}
