import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsDemoRoutingModule } from './chartsdemo-routing.module';
import { ChartModule } from 'primeng/chart'
import { ChartsDemoComponent } from './chartsdemo.component';
import { TableModule } from 'primeng/table';

@NgModule({
	imports: [
		CommonModule,
		ChartsDemoRoutingModule,
		ChartModule,
		TableModule
	],
	declarations: [ChartsDemoComponent]
})
export class ChartsDemoModule { }
