import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Reunion } from '../models/reunion';

@Injectable({
  providedIn: 'root'
})
export class ReunionService {
  constructor(private http: HttpClient, private router: Router) { }

  getReunionById(id: any): Observable<Reunion> {
    return this.http.get<Reunion>('http://localhost:9090/reunion/' + id);
  } 

  getReunion() {
    return this.http.get<Reunion[]>("http://localhost:9090/reunion/");
  }



  addReunion(data: any): Observable<HttpResponse<Reunion>> {
    return this.http.post<Reunion>("http://localhost:9090/reunion/addReunion", data, {
      observe: 'response' // Observe the full response
    }).pipe(
      catchError((error: any) => {
        console.error('Erreur lors de l\'ajout de la réunion:', error);
        return throwError('Une erreur s\'est produite lors de l\'ajout de la réunion. Veuillez réessayer.');
      })
    );
  }
  
  putReunion(id: string, formData: any): Observable<Reunion> {
  return this.http.put<Reunion | HttpErrorResponse>(`http://localhost:9090/reunion/${id}`, formData)
    .pipe(
      map((response: any) => {
        // Vérifier si la réponse est une instance de HttpErrorResponse
        if (response instanceof HttpErrorResponse) {
          // Si c'est une erreur HTTP, propager l'erreur
          throw response;
        } else {
          // Sinon, retourner la réponse comme une instance d'Activite
          return response as Reunion;
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


  deleteReunion(id:any):Observable<Reunion>{
    console.log('deleteProduct called with id:', id);
    return this.http.delete<Reunion>("http://localhost:9090/reunion/"+id)

  }


  updateReunionStatus(reunionId: string, status: string): Observable<Reunion> {
    const url = `http://localhost:9090/reunion/status/${reunionId}`;
    return this.http.put<Reunion>(url, { status });
  }
}