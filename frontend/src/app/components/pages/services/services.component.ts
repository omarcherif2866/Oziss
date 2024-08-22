import { Component, OnInit } from '@angular/core';
import { Service } from '../../models/service';
import { ServiceService } from '../../services/service.service';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

  services: Service[] = [];

  constructor(private serviceService: ServiceService) { }

  ngOnInit(): void {
      this.getAllServices()
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

      
        getAllServices(): void {
          this.serviceService.getService().subscribe(ss => {
            this.services = ss;
            console.log("services récupérées:", ss);
          });
        }

}
