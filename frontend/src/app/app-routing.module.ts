import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/common/not-found/not-found.component';
import { About3Component } from './components/pages/about3/about3.component';
import { CartComponent } from './components/pages/cart/cart.component';
import { CheckoutComponent } from './components/pages/checkout/checkout.component';
import { ComingSoonComponent } from './components/pages/coming-soon/coming-soon.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { PcRepairDemoComponent } from './components/pages/pc-repair-demo/pc-repair-demo.component';
import { ProductsDetailsComponent } from './components/pages/products-details/products-details.component';
import { ProductsComponent } from './components/pages/products/products.component';
import { ServicesDetailsComponent } from './components/pages/services-details/services-details.component';
import { ServicesComponent } from './components/pages/services/services.component';
import { SignupComponent } from './components/pages/signup/signup.component';
import { SigninComponent } from './components/pages/signin/signin.component';
import { AppLayoutComponent } from './dashboard/layout/app.layout.component';

const routes: Routes = [
    { path: '', component: PcRepairDemoComponent },
    { path: 'signup', component: SignupComponent},
    { path: 'signin', component: SigninComponent},
    { path: 'index-4', component: PcRepairDemoComponent },
    { path: 'a_propos', component: About3Component },
    { path: 'services', component: ServicesComponent },
    { path: 'services-details/:id', component: ServicesDetailsComponent },
    { path: 'products', component: ProductsComponent },
    { path: 'products-details/:id', component: ProductsDetailsComponent }, 
    { path: 'cart', component: CartComponent },
    { path: 'checkout', component: CheckoutComponent },
    { path: 'coming-soon', component: ComingSoonComponent },
    { path: 'contact', component: ContactComponent },
    // Here add new pages component



        {
            path: '', component: AppLayoutComponent,
            children: [
                { path: 'dashboard', loadChildren: () => import('./dashboard/esprit/components/uikit/charts/chartsdemo.module').then(m => m.ChartsDemoModule) },
                { path: 'clients', loadChildren: () => import('./dashboard/esprit/components/clients/clients.module').then(m => m.ClientsModule) },
                { path: 'partners', loadChildren: () => import('./dashboard/esprit/components/partners/partners.module').then(m => m.PartnersModule) },
                { path: 'uikit', loadChildren: () => import('./dashboard/esprit/components/uikit/uikit.module').then(m => m.UIkitModule) },
                { path: 'service', loadChildren: () => import('./dashboard/esprit/components/service/service.module').then(m => m.ServiceModule) },
                { path: 'produit', loadChildren: () => import('./dashboard/esprit/components/produit/produit.module').then(m => m.ProduitModule) },
                { path: 'orders', loadChildren: () => import('./dashboard/esprit/components/orders/orders.module').then(m => m.OrdersModule) },
                { path: 'commandes', loadChildren: () => import('./dashboard/esprit/components/commande/commande.module').then(m => m.CommandeModule) },
                { path: 'reunion', loadChildren: () => import('./dashboard/esprit/components/reunion/reunion.module').then(m => m.ReunionModule) },
                { path: 'projet', loadChildren: () => import('./dashboard/esprit/components/projet/projet.module').then(m => m.ProjetModule) },
                { path: 'profil/:id', loadChildren: () => import('./dashboard/esprit/components/profil/profil.module').then(m => m.ProfilModule) },

            ]
        },
        { path: 'auth', loadChildren: () => import('./dashboard/esprit/components/auth/auth.module').then(m => m.AuthModule) },

    //  { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' },




    { path: '**', component: NotFoundComponent } ,
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }