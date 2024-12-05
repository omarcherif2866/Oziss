import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemoignageComponent } from './temoignage.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: TemoignageComponent }
])],
  exports: [RouterModule]
})
export class TemoignageRoutingModule { }
