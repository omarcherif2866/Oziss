import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartnersRoutingModule } from './partners-routing.module';
import { PartnersComponent } from './partners.component';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [PartnersComponent],
  imports: [
    CommonModule,
    TableModule,
    ToastModule,
    InputTextModule,
    PartnersRoutingModule
  ],

  providers: [MessageService]  // Add MessageService here

})
export class PartnersModule { }
