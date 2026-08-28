import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PendingRequestsEmpty } from './pending-requests-empty';

describe('PendingRequestsEmpty', () => {
  let component: PendingRequestsEmpty;
  let fixture: ComponentFixture<PendingRequestsEmpty>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingRequestsEmpty],
    }).compileComponents();

    fixture = TestBed.createComponent(PendingRequestsEmpty);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
