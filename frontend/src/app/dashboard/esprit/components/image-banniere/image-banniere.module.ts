import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImageBanniereRoutingModule } from './image-banniere-routing.module';
import { ImageBanniereComponent } from './image-banniere.component';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';


@NgModule({
  declarations: [ImageBanniereComponent],
  imports: [
    CommonModule,
    TableModule,
    InputTextModule,
    FileUploadModule,
    FormsModule,
    ButtonModule,
    ToastModule,
    ToolbarModule,
    DialogModule,
    TooltipModule,
    ImageBanniereRoutingModule
  ],
  providers: [MessageService]  // Add MessageService here

})
export class ImageBanniereModule { }
