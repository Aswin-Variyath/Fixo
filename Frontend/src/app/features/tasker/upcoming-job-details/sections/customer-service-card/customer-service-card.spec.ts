import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerServiceCard } from './customer-service-card';

describe('CustomerServiceCard', () => {
  let component: CustomerServiceCard;
  let fixture: ComponentFixture<CustomerServiceCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerServiceCard],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerServiceCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
