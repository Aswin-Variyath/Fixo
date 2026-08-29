import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { Availability } from './availability';
describe('Availability', () => { let component: Availability; let fixture: ComponentFixture<Availability>; beforeEach(async () => { await TestBed.configureTestingModule({ imports: [Availability], providers: [provideHttpClient(), provideRouter([])] }).compileComponents(); fixture = TestBed.createComponent(Availability); component = fixture.componentInstance; await fixture.whenStable(); }); it('should create', () => expect(component).toBeTruthy()); });
