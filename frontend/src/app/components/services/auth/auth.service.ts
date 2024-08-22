import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { User } from '../../models/user';
import Swal from 'sweetalert2';

const AUTH_API = 'http://localhost:8075/api/v1/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInSubject: BehaviorSubject<boolean>;

  constructor(private http: HttpClient, private router: Router) {
    // Initialisez le BehaviorSubject à false ou à la valeur stockée dans localStorage
    const storedLoggedIn = localStorage.getItem('loggedIn');
    this.loggedInSubject = new BehaviorSubject<boolean>(storedLoggedIn ? JSON.parse(storedLoggedIn) : false);

  }




  createAcount(data:any){
    return this.http.post<User>("http://localhost:9090/api/signup",data)
  }

  getUser() {
    return this.http.get<User[]>("http://localhost:9090/api/user");
  }

  getUserProfile(id:any) {
    return this.http.get('http://localhost:9090/api/user/'+id)
  }

  updateUserPassword(id: any, motdepasse: string, newPassword: string): Observable<any> {
    const data = {
      password: motdepasse,
      newpassword: newPassword
    };
  
    return this.http.put<any>(`http://localhost:9090/api/user/password/${id}`, data);
  }

  // signIn(credentials:any): Observable<Profil>{
  //   return this.http.post<Profil>("http://localhost:9090/api/signin",credentials)
  // }

  signIn(credentials: any): Observable<User> {
    return this.http.post<User>("http://localhost:9090/api/signin", credentials).pipe(
      tap((user: User) => {
        // Mettez à jour l'état de connexion à true dès que l'utilisateur se connecte avec succès
        this.setLoggedIn(true);
        localStorage.setItem('userRole', user.userType);
        localStorage.setItem('user_email', user.email);
        console.log('userRole', user.userType);

      }),
      
      catchError(this.handleError) // Gérez les erreurs HTTP

    );
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedInSubject.asObservable(); // Retournez le BehaviorSubject en tant qu'Observable
  }

  setLoggedIn(status: boolean) {
    this.loggedInSubject.next(status); // Mettez à jour l'état de connexion avec le BehaviorSubject
    // Stockez également l'état de connexion dans le localStorage
    localStorage.setItem('loggedIn', JSON.stringify(status));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Something went wrong'; // Default error message
  
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 401:
          errorMessage = 'Mot de passe incorrect. Veuillez vérifier votre mot de passe et réessayer.';
          break;
        case 404:
          errorMessage = 'Adresse email incorrecte. L\'adresse email que vous avez saisie est incorrecte ou n\'existe pas.';
          break;
        default:
          errorMessage = `Erreur code ${error.status}: ${error.message}`;
          break;
      }
    }
  

  
    // Throw the error so that the observable chain can be properly handled
    return throwError(() => new Error(errorMessage));
  }
  

  logout(): void {
    this.setLoggedIn(false); // Définissez loggedIn sur false
    localStorage.removeItem('loggedIn'); // Supprimez l'état de connexion du localStorage
    localStorage.removeItem('user_id'); // Supprimez l'ID de l'utilisateur du localStorage
    localStorage.removeItem('userRole'); // Supprimez l'ID de l'utilisateur du localStorage
    localStorage.removeItem('user_email'); // Supprimez l'ID de l'utilisateur du localStorage

  }

  updateUserProfile(id: string, formData: FormData ): Observable<User> {
    return this.http.put<User>(`http://localhost:9090/api/user/profile/${id}`, formData);
  }



  deleteUser(id:any):Observable<User>{
    return this.http.delete<User>("http://localhost:9090/api/user/updateProfileByAdmin/"+id)

  }


  forget(adresse: string): Observable<any> {
    const credentials = { adresse };
    return this.http.post<any>('http://localhost:9090/user/forgotPassword', credentials);
  }

  resetPassword(userId: string, motdepasse: string): Observable<any> {
    return this.http.put<any>(`http://localhost:9090/api/user/password/${userId}`, { motdepasse });
  }

  
}
