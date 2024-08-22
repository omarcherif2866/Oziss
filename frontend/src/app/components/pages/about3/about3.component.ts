import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-about3',
    templateUrl: './about3.component.html',
    styleUrls: ['./about3.component.scss']
})
export class About3Component implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    teamSlides: OwlOptions = {
		loop: true,
		nav: false,
		dots: true,
		autoplayHoverPause: true,
		autoplay: true,
		margin: 30,
		responsive: {
			0: {
				items: 1
			},
			576: {
				items: 2
			},
			768: {
				items: 2
			},
			992: {
				items: 3
			},
			1500: {
				items: 5
			}
		}
    }
    feedbackSlides: OwlOptions = {
		loop: true,
		nav: false,
		smartSpeed: 1000,
		autoplayTimeout: 5000,
		dots: true,
		animateOut: 'fadeOut',
		autoplayHoverPause: true,
		autoplay: true,
		items: 1
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

}