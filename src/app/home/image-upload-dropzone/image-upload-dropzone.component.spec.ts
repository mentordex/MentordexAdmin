import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageUploadDropzoneComponent } from './image-upload-dropzone.component';

describe('ImageUploadDropzoneComponent', () => {
  let component: ImageUploadDropzoneComponent;
  let fixture: ComponentFixture<ImageUploadDropzoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageUploadDropzoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageUploadDropzoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
