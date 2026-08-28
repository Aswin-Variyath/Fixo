import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PendingRequestCard } from './pending-request-card';

describe('PendingRequestCard', () => {
  let component: PendingRequestCard;
  let fixture: ComponentFixture<PendingRequestCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingRequestCard],
    }).compileComponents();

    fixture = TestBed.createComponent(PendingRequestCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
