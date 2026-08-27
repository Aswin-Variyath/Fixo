import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeTaskerComponent } from './become-tasker.component';

describe('BecomeTaskerComponent', () => {
  let component: BecomeTaskerComponent;
  let fixture: ComponentFixture<BecomeTaskerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BecomeTaskerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BecomeTaskerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
