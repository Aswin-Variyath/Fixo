import { Component } from '@angular/core';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { Footer } from '../../../shared/components/footer/footer';
import { EarningsOverview } from './sections/earnings-overview/earnings-overview';
import { TodaysJobs } from './sections/todays-jobs/todays-jobs';

@Component({
  selector: 'app-todays-earnings',
  imports: [Navbar, Footer, EarningsOverview, TodaysJobs],
  templateUrl: './todays-earnings.html',
  styleUrl: './todays-earnings.css',
})
export class TodaysEarnings {}
