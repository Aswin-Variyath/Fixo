import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarningsSummaryCard } from './earnings-summary-card';

describe('EarningsSummaryCard', () => {
  let component: EarningsSummaryCard;
  let fixture: ComponentFixture<EarningsSummaryCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EarningsSummaryCard],
    }).compileComponents();

    fixture = TestBed.createComponent(EarningsSummaryCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
