import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceAddressSection } from './service-address';

describe('ServiceAddressSection', () => {
  let component: ServiceAddressSection;
  let fixture: ComponentFixture<ServiceAddressSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceAddressSection],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceAddressSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
