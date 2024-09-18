import { HttpClient, HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Projet } from '../models/projet';

@Injectable({
  providedIn: 'root'
})
export class ProjetService {
  constructor(private http: HttpClient, private router: Router) { }

  getProjetById(id: any): Observable<Projet> {
    return this.http.get<Projet>('http://localhost:9090/Projet/' + id);
  } 

  getProjet() {
    return this.http.get<Projet[]>("http://localhost:9090/Projet/");
  }



  addProjet(ownedBy: string, data: any): Observable<HttpResponse<Projet>> {
    const url = `http://localhost:9090/Projet/addProjet/${ownedBy}`;
    
    return this.http.post<Projet>(url, data, {
      observe: 'response' // Observe the full response
    }).pipe(
      catchError((error: any) => {
        console.error('Erreur lors de l\'ajout du projet:', error);
        return throwError('Une erreur s\'est produite lors de l\'ajout du projet. Veuillez réessayer.');
      })
    );
  }
  
  
  putProjet(id: string, formData: any): Observable<Projet> {
  return this.http.put<Projet | HttpErrorResponse>(`http://localhost:9090/Projet/${id}`, formData)
    .pipe(
      map((response: any) => {
        // Vérifier si la réponse est une instance de HttpErrorResponse
        if (response instanceof HttpErrorResponse) {
          // Si c'est une erreur HTTP, propager l'erreur
          throw response;
        } else {
          // Sinon, retourner la réponse comme une instance d'Activite
          return response as Projet;
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


  deleteProjet(id:any):Observable<Projet>{
    console.log('deleteProduct called with id:', id);
    return this.http.delete<Projet>("http://localhost:9090/Projet/"+id)

  }


  updateProjetStatus(ProjetId: string, status: string): Observable<Projet> {
    const url = `http://localhost:9090/Projet/status/${ProjetId}`;
    return this.http.put<Projet>(url, { status });
  }

  getProjetsByCriteria(): Observable<Projet[]> {
    const ownedBy = localStorage.getItem('user_id') || '';
    const withUser = localStorage.getItem('user_id') || '';

    // Construct the URL with query parameters
    const url = `http://localhost:9090/Projet/filter?ownedBy=${encodeURIComponent(ownedBy)}&with=${encodeURIComponent(withUser)}`;

    return this.http.get<Projet[]>(url);
  }

}