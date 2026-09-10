import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceOverview } from './service-overview';

describe('ServiceOverview', () => {
  let component: ServiceOverview;
  let fixture: ComponentFixture<ServiceOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ServiceOverview] }).compileComponents();
    fixture = TestBed.createComponent(ServiceOverview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
