import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styles: [`
      :host ::ng-deep .pi-eye,
      :host ::ng-deep .pi-eye-slash {
          transform:scale(1.6);
          margin-right: 1rem;
          color: var(--primary-color) !important;
      }
  `]
})
export class SignupComponent {

  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  form!: FormGroup;
  showClientForm: boolean = false; // Déclaration et initialisation de showClientForm à false

  constructor(private fb: FormBuilder,private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      companyName: ['', Validators.required],
      industry: ['', Validators.required],
      position: ['', Validators.required],
      servicesNeeded: [''],
      mainObjectives: [''],
      estimatedBudget: 0,
      partnershipType: [''],
      partnershipObjectives: [''],
      availableResources: [''],
      image: [null, Validators.required],
      userType: ['client']  // Ajout de userType avec la valeur 'client'

    });
  }

  creerCompte() {
    if (this.form.valid) {
      const formData = new FormData();
  
      // Ajout des champs généraux
      formData.append('nom', this.form.value.nom);
      formData.append('email', this.form.value.email);
      formData.append('phoneNumber', this.form.value.phoneNumber);
      formData.append('password', this.form.value.password);
      formData.append('confirmPassword', this.form.value.confirmPassword);
      formData.append('companyName', this.form.value.companyName);
      formData.append('industry', this.form.value.industry);
      formData.append('position', this.form.value.position);
      formData.append('userType', this.form.value.userType);

      // Champs spécifiques aux clients
      if (this.form.value.servicesNeeded) {
        formData.append('servicesNeeded', this.form.value.servicesNeeded);
      }
      if (this.form.value.mainObjectives) {
        formData.append('mainObjectives', this.form.value.mainObjectives);
      }
      if (this.form.value.estimatedBudget) {
        formData.append('estimatedBudget', this.form.value.estimatedBudget.toString());
      }

  
      // Ajout de l'image
      if (this.form.value.image instanceof File) {
        formData.append('image', this.form.value.image);
      } else {
        console.error('Le champ image doit être un fichier');
      }
  
      // Logs pour SweetAlert
      console.log('Selected role:', this.form.value.userType);
      console.log('Selected image:', this.form.value.image?.name);
  
      this.userService.createAcount(formData).subscribe(
        res => {
          console.log("User registrated successful")

            window.location.reload();
          
        },
        error => {
          console.log("error")

        }
      );
    }
  }
  

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({ image: file });
    }
  }
  

  navigateToPartnerSignup(): void {
    this.router.navigateByUrl('/auth/signupPartner');
  }
}
