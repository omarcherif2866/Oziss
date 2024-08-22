import { Component, OnInit } from '@angular/core';
import { Service } from '../../models/service';
import { ActivatedRoute } from '@angular/router';
import { ServiceService } from '../../services/service.service';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-services-details',
  templateUrl: './services-details.component.html',
  styleUrls: ['./services-details.component.scss']
})
export class ServicesDetailsComponent implements OnInit {

  service: Service | undefined;
  isImageOnLeft: boolean = true; // Détermine si l'image est à gauche ou à droite

  constructor(
    private route: ActivatedRoute,
    private serviceService: ServiceService
  ) { }

  ngOnInit(): void {
    const serviceId = this.route.snapshot.params['id'];
    this.getServiceDetails(serviceId);

  }

  partnerSlides: OwlOptions = {
		loop: true,
		nav: false,
		dots: false,
		autoplayHoverPause: true,
		autoplay: true,
		margin: 30,
		responsive: {
			0: {
				items: 2
			},
			576: {
				items: 4
			},
			768: {
				items: 4
			},
			992: {
				items: 6
			}
		}
    }

  getImageUrl(imageName?: string): string {
    return imageName ? `http://localhost:9090/img/${imageName}` : '';
}

  getServiceDetails(serviceId: string): void {
    this.serviceService.getServiceById(serviceId).subscribe(service => {
      this.service = service;
      console.log("Détails du service récupéré :", service);
      this.isImageOnLeft = Math.random() > 0.5;

    });
  }



}
