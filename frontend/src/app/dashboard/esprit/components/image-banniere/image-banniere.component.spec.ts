import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageBanniereComponent } from './image-banniere.component';

describe('ImageBanniereComponent', () => {
  let component: ImageBanniereComponent;
  let fixture: ComponentFixture<ImageBanniereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageBanniereComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageBanniereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
