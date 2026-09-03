import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobSearchFilters } from './job-search-filters';
describe('JobSearchFilters', () => { let component: JobSearchFilters; let fixture: ComponentFixture<JobSearchFilters>; beforeEach(async () => { await TestBed.configureTestingModule({ imports: [JobSearchFilters] }).compileComponents(); fixture = TestBed.createComponent(JobSearchFilters); component = fixture.componentInstance; await fixture.whenStable(); }); it('should create', () => expect(component).toBeTruthy()); });
