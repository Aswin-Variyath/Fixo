import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerRequestCard } from './customer-request-card';

describe('CustomerRequestCard', () => {
  let component: CustomerRequestCard;
  let fixture: ComponentFixture<CustomerRequestCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerRequestCard],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerRequestCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
