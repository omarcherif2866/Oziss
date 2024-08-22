import { Component } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../service/user.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrl: './partners.component.scss'
})
export class PartnersComponent {
  Users: User[] = [];
  user!:User;
  cols: any[] = [];

  constructor(
    private userService: UserService, private messageService: MessageService


  ) {}

  ngOnInit() {
    this.getAllClients()
  }

  getAllClients(): void {
    this.userService.getUser().subscribe(ss => {
      // Afficher les utilisateurs récupérés dans la console
      console.log("Users récupérées:", ss);
      
      // Filtrer les utilisateurs pour ne garder que ceux avec userType = 'client'
      this.Users = ss.filter(user => user.userType === 'partner');
      
      // Afficher les utilisateurs filtrés dans la console pour vérification
      console.log("Clients filtrés:", this.Users);
    }, error => {
      // Gestion des erreurs
      console.error("Erreur lors de la récupération des utilisateurs:", error);
    });
  }

  getImageUrl(imageName: string): string {
    return `http://localhost:9090/img/${imageName}`;
  }

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  

}
