import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router'; // Ajoutez ceci

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxScrollTopModule } from 'ngx-scrolltop';
import { CountUpModule } from 'ngx-countup';
import { IconsService } from './components/common/icons/icons.service';
import { PcRepairDemoComponent } from './components/pages/pc-repair-demo/pc-repair-demo.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { NotFoundComponent } from './components/common/not-found/not-found.component';
import { ProductsComponent } from './components/pages/products/products.component';
import { ProductsDetailsComponent } from './components/pages/products-details/products-details.component';
import { CheckoutComponent } from './components/pages/checkout/checkout.component';
import { ComingSoonComponent } from './components/pages/coming-soon/coming-soon.component';
import { About3Component } from './components/pages/about3/about3.component';
import { ServicesComponent } from './components/pages/services/services.component';
import { ServicesDetailsComponent } from './components/pages/services-details/services-details.component';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './components/common/footer/footer.component';
import { NavbarStyleOneComponent } from './components/common/navbar-style-one/navbar-style-one.component';
import { SignupComponent } from './components/pages/signup/signup.component';
import { SigninComponent } from './components/pages/signin/signin.component';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { NodeService } from './dashboard/esprit/service/node.service';
import { IconService } from './dashboard/esprit/service/icon.service';
import { EventService } from './dashboard/esprit/service/event.service';
import { CustomerService } from './dashboard/esprit/service/customer.service';
import { ProductService } from './dashboard/esprit/service/product.service';
import { CountryService } from './dashboard/esprit/service/country.service';
import { PhotoService } from './dashboard/esprit/service/photo.service';
import { AppLayoutModule } from './dashboard/layout/app.layout.module';
import { AuthModule } from './dashboard/esprit/components/auth/auth.module';
import { CommandeModule } from './dashboard/esprit/components/commande/commande.module';
import { OrdersModule } from './dashboard/esprit/components/orders/orders.module';
import { ProduitModule } from './dashboard/esprit/components/produit/produit.module';
import { ProfilModule } from './dashboard/esprit/components/profil/profil.module';
import { ServiceModule } from './dashboard/esprit/components/service/service.module';
import { UIkitModule } from './dashboard/esprit/components/uikit/uikit.module';
import { CartComponent } from './components/pages/cart/cart.component';
import { ClientsModule } from './dashboard/esprit/components/clients/clients.module';
import { ReunionModule } from './dashboard/esprit/components/reunion/reunion.module';
import { CommercialModule } from './dashboard/esprit/components/commercial/commercial.module';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    PcRepairDemoComponent,
    NavbarStyleOneComponent,
    ContactComponent,
    NotFoundComponent,
    ProductsComponent,
    ProductsDetailsComponent,
    CartComponent,
    CheckoutComponent,
    ComingSoonComponent,
    About3Component,
    ServicesComponent,
    ServicesDetailsComponent,
    SignupComponent,
    SigninComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CarouselModule,
    BrowserAnimationsModule,
    NgxScrollTopModule,
    IconsService,
    CountUpModule,
    HttpClientModule,
    RouterModule, // Ajoutez ceci
    ReactiveFormsModule,
    AppLayoutModule, 
    AuthModule,
    CommandeModule,
    OrdersModule,
    ClientsModule,
    ProduitModule,
    ProfilModule,
    ServiceModule,
    ReunionModule,
    UIkitModule,
    CommercialModule
    
    
  ],
  providers: [        { provide: LocationStrategy, useClass: PathLocationStrategy },
    CountryService, CustomerService, EventService, IconService, NodeService,
    PhotoService, ProductService,],

  bootstrap: [AppComponent]
})
export class AppModule { }
