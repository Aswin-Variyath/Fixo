import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerServiceSummary } from './customer-service-summary';

describe('CustomerServiceSummary', () => {
  let component: CustomerServiceSummary;
  let fixture: ComponentFixture<CustomerServiceSummary>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CustomerServiceSummary] }).compileComponents();
    fixture = TestBed.createComponent(CustomerServiceSummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });
  it('should create', () => expect(component).toBeTruthy());
});
