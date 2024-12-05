import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        const userRole = localStorage.getItem('userRole');

        this.model = [

            {
                label: 'Tableau de bord',
                items: [
                    { label: 'Tableau de bord', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/dashboard'] },                ]
            },


            {
                label: 'Produits',
                items: [
                    { label: 'Produits', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/produit'] }
                ]
            },




        ];

        if (userRole === 'admin') {
            this.model.splice(5, 0, {
                label: 'Utilisateurs',
                items: [
                    { label: 'Tous les clients', icon: 'pi pi-fw pi-users', routerLink: ['/clients'] },
                    { label: 'Tous les partenaires', icon: 'pi pi-fw pi-users', routerLink: ['/partners'] },
                    { label: 'Commerciales', icon: 'pi pi-fw pi-users', routerLink: ['/commercial'] }

                ]
            });

            this.model.splice(2, 0, {
                label: 'Service',
                items: [
                    { label: 'Services', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/service'] }
                ]
            });
            
            this.model.splice(5, 0, {
                label: 'Commandes',
                items: [
                    { label: 'Commandes', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/orders'] }
                ]
            });

            this.model.splice(2, 0, {
                label: 'Reunion',
                items: [
                    { label: 'Reunion', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/reunion'] }
                ]
            });

            this.model.splice(2, 0, {
                label: 'Projet',
                items: [
                    { label: 'Projet', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/projet'] }
                ]
            });

            this.model.splice(2, 0, {
                label: 'Actualites',
                items: [
                    { label: 'Actualites', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/actualite'] }
                ]
            });

            this.model.splice(2, 0, {
                label: 'Images de la banniére',
                items: [
                    { label: 'Images de la banniére', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/imageBanniere'] }
                ]
            });


        } else if (userRole === 'client'){
            this.model.splice(2, 0, {
                label: 'Mes Commandes',
                items: [
                    { label: 'Mes Commandes', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/commandes'] }
                ]
            });
            this.model.splice(2, 0, {
                label: 'Temoignages',
                items: [
                    { label: 'Temoignages', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/temoignages'] }
                ]
            });
        } else if (userRole === 'partner') {
            this.model.splice(2, 0, {
                label: 'Reunion',
                items: [
                    { label: 'Reunion', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/reunion'] }
                ]
            });

            this.model.splice(2, 0, {
                label: 'Projets et Collaborations',
                items: [
                    { label: 'Projets', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/projet'] }
                ]
            });
            this.model.splice(2, 0, {
                label: 'Temoignages',
                items: [
                    { label: 'Temoignages', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/temoignages'] }
                ]
            });
        } else if (userRole === 'commercial') {
            this.model.splice(5, 0, {
                label: 'Utilisateurs',
                items: [
                    { label: 'Tous les clients', icon: 'pi pi-fw pi-users', routerLink: ['/clients'] },
                    { label: 'Tous les partenaires', icon: 'pi pi-fw pi-users', routerLink: ['/partners'] },
                    { label: 'Commerciales', icon: 'pi pi-fw pi-users', routerLink: ['/commercial'] }

                ]
            });

            this.model.splice(2, 0, {
                label: 'Service',
                items: [
                    { label: 'Services', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/service'] }
                ]
            });
            
            this.model.splice(5, 0, {
                label: 'Commandes',
                items: [
                    { label: 'Commandes', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/orders'] }
                ]
            });

            this.model.splice(2, 0, {
                label: 'Reunion',
                items: [
                    { label: 'Reunion', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/reunion'] }
                ]
            });

            this.model.splice(2, 0, {
                label: 'projet',
                items: [
                    { label: 'projet', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/projet'] }
                ]
            });

        }
        
    }
}
