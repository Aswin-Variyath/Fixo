import { Component, signal } from '@angular/core';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { Footer } from '../../../shared/components/footer/footer';
import { UpcomingJobsHeader } from './sections/upcoming-jobs-header/upcoming-jobs-header';
import { UpcomingJobsToolbar } from './sections/upcoming-jobs-toolbar/upcoming-jobs-toolbar';
import { UpcomingJobCard, UpcomingJobItem } from './sections/upcoming-job-card/upcoming-job-card';
import { UpcomingJobsEmpty } from './sections/upcoming-jobs-empty/upcoming-jobs-empty';

@Component({
  selector: 'app-upcoming-jobs',
  imports: [
    Navbar,
    Footer,
    UpcomingJobsHeader,
    UpcomingJobsToolbar,
    UpcomingJobCard,
    UpcomingJobsEmpty,
  ],
  templateUrl: './upcoming-jobs.html',
  styleUrl: './upcoming-jobs.css',
})
export class UpcomingJobs {
  readonly isEmptyState = signal<boolean>(false);

  readonly jobs: UpcomingJobItem[] = [
    {
      id: '1',
      serviceTitle: 'Electrical Wiring',
      serviceIcon: 'electric_bolt',
      status: 'CONFIRMED',
      date: 'Aug 25, 2026',
      time: '10:00 AM',
      duration: '3h (Est.)',
      customerName: 'Rahul Nair',
      customerAvatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDrQtQDhQp5oNUF2H063pAxTkx5g0D5ebcRBDwQCu0qy24KoPRNBZvsB3AC0ZNDC6ynKGOP-qNJdvmFo93P7U0yPk5N1xNlVrLOriOjvkORobwl0suwZhkf4iosxnuDnVhXecf96TjMmLXQ-as7iuO4ZpGyg6uCKs8kD8IAX3SQGLo3rLIrT5j5nHITgN4g360FxcezURzWN9el4maqGQFT6rVafN6Vbf6L0nL74C3nX5B7meRz4G8e',
      location: 'Kozhikode, Kerala',
      estimatedEarnings: '₹1,200',
    },
    {
      id: '2',
      serviceTitle: 'Plumbing Repair',
      serviceIcon: 'plumbing',
      status: 'CONFIRMED',
      date: 'Aug 26, 2026',
      time: '2:00 PM',
      duration: '2h (Est.)',
      customerName: 'Arjun Menon',
      customerAvatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCLEn3hojEm4d1lbsrKfh0o4MibPIs-tTgVMcI8hs_oA1R8EJwV5NW3PotmsFs59EZjYs2B3UIf0vYxTmgfqV7JgCBUPX7jjinAhiRgmvvnmzZFgaAsedTIYOiJMfs6T_9E6bxPHzMRHvvRJYNBuu1E8CsxEIBPfHLlvnMkuYOpZojS7RHNNY5jEEAZTImm_WLCDzDWBwqaA5LX4AuTdT4NcP79psmotXdwjaqChOhXA2-SsAtrItg6',
      location: 'Kallai, Kozhikode',
      estimatedEarnings: '₹900',
    },
    {
      id: '3',
      serviceTitle: 'AC Service & Repair',
      serviceIcon: 'ac_unit',
      status: 'CONFIRMED',
      date: 'Aug 28, 2026',
      time: '11:30 AM',
      duration: '2h (Est.)',
      customerName: 'Neha Thomas',
      customerAvatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC7oMgJqTK0NpqXEagPPpnHq1YBBeW1HPkoCbSSNSZXypIbVXibVqSzk4FXwdlysGaTCCN86689ND-8I9Ae_sHIheyfT9UBviDrfbhaCSz5v3y3VpdcXQ4VaamFktAU5mXulbja5a-8f8GXtDj092ol33vb99BAjCoxApDKnks9dn7c2yzXUBibZ9cx0dHbnuQ8bsasbiFHK5wTIzl0qIiD18DUrARUZ4YCOp3mru5UENQE4Fff6gH9',
      location: 'West Hill, Kozhikode',
      estimatedEarnings: '₹1,000',
    },
    {
      id: '4',
      serviceTitle: 'Home Painting',
      serviceIcon: 'format_paint',
      status: 'CONFIRMED',
      date: 'Aug 30, 2026',
      time: '9:00 AM',
      duration: '5h (Est.)',
      customerName: 'Suresh Kumar',
      customerAvatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD1ABie7HA4u3me2vRZR4TEimtRWxZaTecFLngCXMqfJJlcXEEv65Au2_PUx5iBqi2tGeZK-W4e6yJw4KI8RO-PCWSut3R4RV3rdCz9hWeFO4Kuu27-Tn-qyESddWToGs6xvZZNQfbzr2cO45hRXfKV9ooXVh94OvP430H1l875DuLY5i6VYMVdsgSRqimof9Z-4aSZ98-qCDUsAiadYAkaSnZkSJevgNTK_7_Znn-6CsFN1_ttjdWT',
      location: 'Nadakkavu, Kozhikode',
      estimatedEarnings: '₹2,500',
    },
  ];

  toggleState(): void {
    this.isEmptyState.update((v) => !v);
  }
}
