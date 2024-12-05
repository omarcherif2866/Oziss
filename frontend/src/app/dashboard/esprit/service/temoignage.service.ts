import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Temoignage } from '../models/temoignage';
@Injectable({
  providedIn: 'root'
})
export class TemoignageService {
  constructor(private http: HttpClient, private router: Router) { }



  getTemoignage() {
    return this.http.get<Temoignage[]>("http://localhost:9090/user/getAllTemoignage");
  }

  getLastThreeTemoignages(): Observable<any> {
    return this.http.get<any>("http://localhost:9090/user/getLastThreeTemoignage");
  }

  getTemoignagesByCreateur(createurId:any): Observable<Temoignage[]> {
    return this.http.get<Temoignage[]>("http://localhost:9090/user/temoignages/createur/"+createurId);
  }

  addTemoignage(data: any): Observable<Temoignage> {
    return this.http.post<Temoignage>("http://localhost:9090/user/addTemoignage", data)
      .pipe(
        catchError((error: any) => {
          console.error('Erreur lors de l\'ajout du Temoignage:', error);
          return throwError('Une erreur s\'est Temoignagee lors de l\'ajout du Temoignage. Veuillez réessayer.');
        })
      );
  }



  deleteTemoignage(id:any):Observable<Temoignage>{
    console.log('deleteTemoignage called with id:', id);
    return this.http.delete<Temoignage>("http://localhost:9090/user/deleteTemoignage/"+id)

  }
}
