import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingJobCard } from './upcoming-job-card';

describe('UpcomingJobCard', () => {
  let component: UpcomingJobCard;
  let fixture: ComponentFixture<UpcomingJobCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpcomingJobCard],
    }).compileComponents();

    fixture = TestBed.createComponent(UpcomingJobCard);
    fixture.componentRef.setInput('job', {
      id: '1',
      serviceTitle: 'Electrical Wiring',
      serviceIcon: 'electric_bolt',
      status: 'CONFIRMED',
      date: 'Aug 25, 2026',
      time: '10:00 AM',
      duration: '3h (Est.)',
      customerName: 'Rahul Nair',
      customerAvatar: '',
      location: 'Kozhikode, Kerala',
      estimatedEarnings: '₹1,200',
    });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
