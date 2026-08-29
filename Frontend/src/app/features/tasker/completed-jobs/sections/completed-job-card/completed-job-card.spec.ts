import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedJobCard } from './completed-job-card';

describe('CompletedJobCard', () => {
  let component: CompletedJobCard;
  let fixture: ComponentFixture<CompletedJobCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompletedJobCard],
    }).compileComponents();

    fixture = TestBed.createComponent(CompletedJobCard);
    fixture.componentRef.setInput('job', {
      id: 'completed-1',
      serviceTitle: 'Electrical Wiring',
      customerName: 'Rahul Nair',
      date: 'Aug 25, 2026',
      amount: '₹1,200',
      customerAvatar: '',
    });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
