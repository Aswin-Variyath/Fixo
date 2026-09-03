import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimatedEarnings } from './estimated-earnings';

describe('EstimatedEarnings', () => {
  let component: EstimatedEarnings;
  let fixture: ComponentFixture<EstimatedEarnings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstimatedEarnings],
    }).compileComponents();

    fixture = TestBed.createComponent(EstimatedEarnings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
