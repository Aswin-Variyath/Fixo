import { Component, input } from '@angular/core';

interface ScheduleDay { day: string; available: boolean; }

@Component({ selector: 'app-availability-schedule', imports: [], templateUrl: './availability-schedule.html', styleUrl: './availability-schedule.css' })
export class AvailabilitySchedule {
  readonly restricted = input(false);
  readonly days: ScheduleDay[] = [
    { day: 'Mon', available: true }, { day: 'Tue', available: true }, { day: 'Wed', available: false },
    { day: 'Thu', available: true }, { day: 'Fri', available: true }, { day: 'Sat', available: false }, { day: 'Sun', available: false },
  ];
  readonly mapImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1AE5Xel_sBeRq5n1BRAGDFA-FiThuATDDLAXs4myO2gWNVX1m_XVcn4E4WvhOy4Lm8P8pVGOeFStPJSo3e7kSuaG9p8q9dKmF9B3v2EYsDAcmIAIR4WUJNmCq7MEHXrVvneYE_1fR6xf4OI1wvnj3gcCHgvr8BKoDvH3-NBxLoMJPRewWtBoTTwNaglQ6QTO1clybTRXSGYudzHtCld52QeyXjbZWpz9vmBPm95_j5yy6heb3ulvd';
}
