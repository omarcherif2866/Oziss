import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageBanniereComponent } from './image-banniere.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: ImageBanniereComponent }
])],
  exports: [RouterModule]
})
export class ImageBanniereRoutingModule { }
