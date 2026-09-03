import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodaysJobs } from './todays-jobs';
describe('TodaysJobs', () => { let component: TodaysJobs; let fixture: ComponentFixture<TodaysJobs>; beforeEach(async () => { await TestBed.configureTestingModule({ imports: [TodaysJobs] }).compileComponents(); fixture = TestBed.createComponent(TodaysJobs); component = fixture.componentInstance; await fixture.whenStable(); }); it('should create', () => expect(component).toBeTruthy()); });
