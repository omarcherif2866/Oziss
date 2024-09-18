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
            // {
            //     label: 'Home',
            //     items: [
            //         { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] }
            //     ]
            // },

            {
                label: 'UI Components',
                items: [
                    { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/dashboard'] },                ]
            },


            {
                label: 'Produits',
                items: [
                    { label: 'Produits', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/produit'] }
                ]
            },


            {
                label: 'Pages',
                icon: 'pi pi-fw pi-briefcase',
                items: [
    
                    {
                        label: 'Auth',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                label: 'Login',
                                icon: 'pi pi-fw pi-sign-in',
                                routerLink: ['/auth/login']
                            },
                            {
                                label: 'Signup',
                                icon: 'pi pi-fw pi-sign-in',
                                routerLink: ['/auth/signup']
                            },

                        ]
                    },

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
                label: 'projet',
                items: [
                    { label: 'projet', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/projet'] }
                ]
            });


        } else if (userRole === 'client'){
            this.model.splice(2, 0, {
                label: 'Mes Commandes',
                items: [
                    { label: 'Mes Commandes', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/commandes'] }
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
