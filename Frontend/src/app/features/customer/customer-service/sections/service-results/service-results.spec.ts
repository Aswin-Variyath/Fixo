import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceResults } from './service-results';

describe('ServiceResults', () => {
  let component: ServiceResults;
  let fixture: ComponentFixture<ServiceResults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceResults],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceResults);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
