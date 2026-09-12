import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecommendedTaskers } from './recommended-taskers';

describe('RecommendedTaskers', () => {
  let component: RecommendedTaskers;
  let fixture: ComponentFixture<RecommendedTaskers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [RecommendedTaskers] }).compileComponents();
    fixture = TestBed.createComponent(RecommendedTaskers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
