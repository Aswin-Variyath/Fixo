import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoUploadSection } from './photo-upload';

describe('PhotoUploadSection', () => {
  let component: PhotoUploadSection;
  let fixture: ComponentFixture<PhotoUploadSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoUploadSection],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoUploadSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
