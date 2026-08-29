import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { TodaysEarnings } from './todays-earnings';

describe('TodaysEarnings', () => {
  let component: TodaysEarnings;
  let fixture: ComponentFixture<TodaysEarnings>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TodaysEarnings], providers: [provideHttpClient(), provideRouter([])] }).compileComponents();
    fixture = TestBed.createComponent(TodaysEarnings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });
  it('should create', () => expect(component).toBeTruthy());
});
