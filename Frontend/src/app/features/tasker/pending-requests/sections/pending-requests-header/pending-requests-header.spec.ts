import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PendingRequestsHeader } from './pending-requests-header';

describe('PendingRequestsHeader', () => {
  let component: PendingRequestsHeader;
  let fixture: ComponentFixture<PendingRequestsHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingRequestsHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(PendingRequestsHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
