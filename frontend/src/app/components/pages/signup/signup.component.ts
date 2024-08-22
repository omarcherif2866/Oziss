import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AuthService } from 'src/app/components/services/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  form!: FormGroup;
  formPartner!: FormGroup;
  showClientForm: boolean = false; // Déclaration et initialisation de showClientForm à false
  showPartnerForm: boolean = false; // Déclaration et initialisation de showClientForm à false

  hoveredElement: string | null = null;

  constructor(private fb: FormBuilder, private userService: AuthService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
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

    this.formPartner = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
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
      userType: ['partner']  // Ajout de userType avec la valeur 'client'

    });
  }

  partnerSlides: OwlOptions = {
		loop: true,
		nav: false,
		dots: false,
		autoplayHoverPause: true,
		autoplay: true,
		margin: 30,
		responsive: {
			0: {
				items: 2
			},
			576: {
				items: 4
			},
			768: {
				items: 4
			},
			992: {
				items: 6
			}
		}
    }

  onHover(element: string | null) {
    this.hoveredElement = element;
  }


  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;

    if (!passwordValid) {
      return { passwordStrength: true };
    }

    return null;
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
          Swal.fire({
            icon: 'success',
            title: 'Vous êtes inscrit avec succés',
            showConfirmButton: false,
            timer: 1500
          }); 
            window.location.reload();
          
        },
        error => {
          console.log("error")
          Swal.fire({
            icon: 'error',
            title: 'Vérifier vos données',
            showConfirmButton: false,
            timer: 1500
          }); 
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

  creerComptePartner() {
    if (this.formPartner.valid) {
      const formData = new FormData();
  
      // Ajout des champs généraux
      formData.append('nom', this.formPartner.value.nom);
      formData.append('email', this.formPartner.value.email);
      formData.append('phoneNumber', this.formPartner.value.phoneNumber);
      formData.append('password', this.formPartner.value.password);
      formData.append('confirmPassword', this.formPartner.value.confirmPassword);
      formData.append('companyName', this.formPartner.value.companyName);
      formData.append('industry', this.formPartner.value.industry);
      formData.append('position', this.formPartner.value.position);
      formData.append('userType', this.formPartner.value.userType);
  
      // Champs spécifiques aux partenaires
      if (this.formPartner.value.partnershipType) {
        formData.append('partnershipType', this.formPartner.value.partnershipType);
      }
      if (this.formPartner.value.partnershipObjectives) {
        formData.append('partnershipObjectives', this.formPartner.value.partnershipObjectives);
      }
      if (this.formPartner.value.availableResources) {
        formData.append('availableResources', this.formPartner.value.availableResources);
      }
  
      // Ajout de l'image
      if (this.formPartner.value.image instanceof File) {
        formData.append('image', this.formPartner.value.image);
      } else {
        console.error('Le champ image doit être un fichier');
      }
  
      // Logs pour SweetAlert
      console.log('Selected role:', this.formPartner.value.userType);
      console.log('Selected image:', this.formPartner.value.image?.name);
  
      this.userService.createAcount(formData).subscribe(
        res => {
          console.log("User registrated successful")
          Swal.fire({
            icon: 'success',
            title: 'Vous êtes inscrit avec succés',
            showConfirmButton: false,
            timer: 1500
          }); 
            window.location.reload();
          
        },
        error => {
          console.log("error")
          Swal.fire({
            icon: 'error',
            title: 'Vérifier vos données',
            showConfirmButton: false,
            timer: 1500
          }); 
        }
      );
    }
  }

  onFileChangePartner(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.formPartner.patchValue({ image: file });
    }
  }


  get signupPassword() {
    return this.form.get('password');
  }

  // Méthode pratique pour accéder plus facilement au champ de formulaire partnerForm.password
  get partnerPassword() {
    return this.formPartner.get('password');
  }

}