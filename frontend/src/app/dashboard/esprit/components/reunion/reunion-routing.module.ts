import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReunionComponent } from './reunion.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: ReunionComponent }
])],
  exports: [RouterModule]
})
export class ReunionRoutingModule { }
