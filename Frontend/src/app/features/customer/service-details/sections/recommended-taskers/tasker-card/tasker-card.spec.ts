import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskerCard } from './tasker-card';

describe('TaskerCard', () => {
  let component: TaskerCard;
  let fixture: ComponentFixture<TaskerCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaskerCard] }).compileComponents();
    fixture = TestBed.createComponent(TaskerCard);
    fixture.componentRef.setInput('tasker', {
      imageUrl: 'https://example.test/avatar.jpg', name: 'Alex Johnson', title: 'Professional Plumber',
      rating: '4.9', reviewCount: 128, distance: '3.2 km', availability: 'Available Today',
    });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
