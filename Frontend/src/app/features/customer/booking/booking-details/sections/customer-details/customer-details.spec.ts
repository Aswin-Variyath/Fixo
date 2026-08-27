import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDetailsSection } from './customer-details';

describe('CustomerDetailsSection', () => {
  let component: CustomerDetailsSection;
  let fixture: ComponentFixture<CustomerDetailsSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerDetailsSection],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerDetailsSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
