import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { PendingRequestDetails } from './pending-request-details';

describe('PendingRequestDetails', () => {
  let component: PendingRequestDetails;
  let fixture: ComponentFixture<PendingRequestDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingRequestDetails],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PendingRequestDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
