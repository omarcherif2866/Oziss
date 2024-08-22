import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Produit } from '../models/produit';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  constructor(private http: HttpClient, private router: Router) { }

  getProductById(id: any): Observable<Produit> {
    return this.http.get<Produit>('http://localhost:9090/produit/' + id);
  } 

  getProduct() {
    return this.http.get<Produit[]>("http://localhost:9090/produit/");
  }



  addProduct(data: any): Observable<Produit> {
    return this.http.post<Produit>("http://localhost:9090/produit", data)
      .pipe(
        catchError((error: any) => {
          console.error('Erreur lors de l\'ajout du Product:', error);
          return throwError('Une erreur s\'est produite lors de l\'ajout du Product. Veuillez réessayer.');
        })
      );
  }

  putProduct(id: string, formData: any): Observable<Produit> {
  return this.http.put<Produit | HttpErrorResponse>(`http://localhost:9090/produit/${id}`, formData)
    .pipe(
      map((response: any) => {
        // Vérifier si la réponse est une instance de HttpErrorResponse
        if (response instanceof HttpErrorResponse) {
          // Si c'est une erreur HTTP, propager l'erreur
          throw response;
        } else {
          // Sinon, retourner la réponse comme une instance d'Activite
          return response as Produit;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Traiter les erreurs HTTP ici
        console.error('Erreur lors de la mise à jour du Product:', error);
        // Retourner une erreur observable
        return throwError('Une erreur s\'est produite lors de la mise à jour du Product. Veuillez réessayer.');
      })
    );
}


  deleteProduct(id:any):Observable<Produit>{
    console.log('deleteProduct called with id:', id);
    return this.http.delete<Produit>("http://localhost:9090/produit/"+id)

  }

  getProductCount(): Observable<any> {
    return this.http.get<any>(`http://localhost:9090/produit/count`);
  }

  getProductsByService(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:9090/produit/products-by-service`);
  }

  getTopSellingProducts(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:9090/produit/top-selling-products`);
  }
}