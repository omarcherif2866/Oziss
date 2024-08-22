import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import Swal from 'sweetalert2';
import { User } from '../../../models/user';
import { LayoutService } from 'src/app/dashboard/layout/service/app.layout.service';
import { UserService } from '../../../service/user.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
  
    `],
    providers: [MessageService] ,

})
export class LoginComponent implements OnInit {

    valCheck: string[] = ['remember'];
    password!: string;
    form!: FormGroup;
    user!: User;
    messages: Message[] = []; // Propriété pour stocker les messages à afficher

    constructor(public layoutService: LayoutService, private formBuilder: FormBuilder, private service: UserService,
      private router:Router,  private messageService: MessageService
    ) { }
  
    ngOnInit(): void {
      this.form = this.formBuilder.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
      });
  
      window.addEventListener('storage', this.syncLocalStorage.bind(this));
    }
  
    ngOnDestroy(): void {
      window.removeEventListener('storage', this.syncLocalStorage.bind(this));
    }
  
    signin() {
      if (this.form.valid) {
        const t = {
          email: this.form.value.email,
          password: this.form.value.password,
        };
  
        this.service.signIn(t).subscribe(
          (data) => {
            this.user = data;
            localStorage.setItem('user_id', data._id!); // Store user ID
            localStorage.setItem('user_email', data.email!); // Store user email
            console.log('User ID:', data._id);
            console.log('User ID stored in localStorage:', localStorage.getItem('user_id'));
            console.log('User email stored in localStorage:', localStorage.getItem('user_email'));
            console.log('connexion réussie');
            this.service.setLoggedIn(true);
            console.log("signin successful");
            Swal.fire({
              icon: 'success',
              title: 'Vous êtes connecté',
              showConfirmButton: false,
              timer: 1500
            });            
            this.router.navigate(['/profil', data._id]);
          },
          (error) => {
            console.error(error);
            console.log("signin error");
          }
        );
      }
    }

    private syncLocalStorage(event: StorageEvent): void {
      if (event.key === 'loggedIn') {
        this.service.setLoggedIn(JSON.parse(event.newValue!));
      }
    }
  }
