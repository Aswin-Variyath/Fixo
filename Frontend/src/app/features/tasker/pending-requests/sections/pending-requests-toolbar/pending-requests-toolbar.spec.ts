import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PendingRequestsToolbar } from './pending-requests-toolbar';

describe('PendingRequestsToolbar', () => {
  let component: PendingRequestsToolbar;
  let fixture: ComponentFixture<PendingRequestsToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingRequestsToolbar],
    }).compileComponents();

    fixture = TestBed.createComponent(PendingRequestsToolbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
