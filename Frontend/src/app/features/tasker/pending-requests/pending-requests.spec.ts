import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { PendingRequests } from './pending-requests';

describe('PendingRequests', () => {
  let component: PendingRequests;
  let fixture: ComponentFixture<PendingRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingRequests],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PendingRequests);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
