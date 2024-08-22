import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Service } from '../models/service';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient, private router: Router) { }

  getServiceById(id: any): Observable<Service> {
    return this.http.get<Service>('http://localhost:9090/service/' + id);
  } 

  getService() {
    return this.http.get<Service[]>("http://localhost:9090/service");
  }



  addService(data: any): Observable<Service> {
    return this.http.post<Service>("http://localhost:9090/service", data)
    .pipe(
      catchError((error: any) => {
        console.error('Erreur lors de l\'ajout du Service:', error);
        return throwError('Une erreur s\'est produite lors de l\'ajout du Service. Veuillez réessayer.');
      })
    );
}

  putService(id: string, formData: any): Observable<Service> {
  return this.http.put<Service | HttpErrorResponse>(`http://localhost:9090/service/${id}`, formData)
    .pipe(
      map((response: any) => {
        // Vérifier si la réponse est une instance de HttpErrorResponse
        if (response instanceof HttpErrorResponse) {
          // Si c'est une erreur HTTP, propager l'erreur
          throw response;
        } else {
          // Sinon, retourner la réponse comme une instance d'Activite
          return response as Service;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Traiter les erreurs HTTP ici
        console.error('Erreur lors de la mise à jour du Service:', error);
        // Retourner une erreur observable
        return throwError('Une erreur s\'est produite lors de la mise à jour du Service. Veuillez réessayer.');
      })
    );
}


  deleteService(id:any):Observable<Service>{
    console.log('deleteService called with id:', id);
    return this.http.delete<Service>("http://localhost:9090/service/"+id)

  }
}
