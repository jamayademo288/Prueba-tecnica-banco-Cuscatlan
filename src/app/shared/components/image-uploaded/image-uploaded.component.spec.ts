import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageUploadedComponent } from './image-uploaded.component';

describe('ImageUploaderComponent', () => {
  let component: ImageUploadedComponent;
  let fixture: ComponentFixture<ImageUploadedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImageUploadedComponent]
    });
    fixture = TestBed.createComponent(ImageUploadedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
