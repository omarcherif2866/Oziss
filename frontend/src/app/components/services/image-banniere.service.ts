import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, Subject, throwError } from 'rxjs';
import { ImageBanniere } from '../models/image-banniere';

@Injectable({
  providedIn: 'root'
})
export class ImageBanniereService {

  constructor(private http: HttpClient, private router: Router) { }


  addImage(data: any): Observable<ImageBanniere> {
    return this.http.post<ImageBanniere>("http://localhost:9090/imageBanniere", data)
      .pipe(
        catchError((error: any) => {
          console.error('Erreur lors de l\'ajout du ImageBanniere:', error);
          return throwError('Une erreur s\'est ImageBanniere lors de l\'ajout du Product. Veuillez réessayer.');
        })
      );
  }

  getImage() {
    return this.http.get<ImageBanniere[]>("http://localhost:9090/imageBanniere/");
  }

  deleteImage(id:any):Observable<ImageBanniere>{
    console.log('deleteimageBanniere called with id:', id);
    return this.http.delete<ImageBanniere>("http://localhost:9090/imageBanniere/"+id)

  }
}
