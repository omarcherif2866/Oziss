import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TemoignageComponent } from './temoignage.component';
import { TemoignageRoutingModule } from './temoignage-routing.module';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';


@NgModule({
  declarations: [TemoignageComponent],
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    ToastModule,
    ToolbarModule,
    InputTextareaModule,
    DialogModule,
    TemoignageRoutingModule
  ],

  providers: [MessageService]  // Add MessageService here

})
export class TemoignageModule { }
