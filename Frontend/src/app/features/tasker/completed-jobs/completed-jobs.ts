import { Component } from '@angular/core';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { Footer } from '../../../shared/components/footer/footer';
import {
  CompletedJobCard,
  CompletedJobItem,
} from './sections/completed-job-card/completed-job-card';
import { CompletedJobsHeader } from './sections/completed-jobs-header/completed-jobs-header';

@Component({
  selector: 'app-completed-jobs',
  imports: [Navbar, Footer, CompletedJobsHeader, CompletedJobCard],
  templateUrl: './completed-jobs.html',
  styleUrl: './completed-jobs.css',
})
export class CompletedJobs {
  readonly jobs: CompletedJobItem[] = [
    {
      id: 'completed-1',
      serviceTitle: 'Electrical Wiring',
      customerName: 'Rahul Nair',
      date: 'Aug 25, 2026',
      amount: '₹1,200',
      customerAvatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAt1eee_-wBh_sKFWgEgPnNhziSafcnWv4ymZfyjpR2_KGximMUhr_a0qJ-V7tvBHJBYOY_7KXigIvsKnGl3Ugl-PKfdLl2WNP_ceou3NXP3LVlFOHakXRRSvDCcUIAA1-VSa5tIokcJdmNNxUW9W8fHyksPOiSNLBII0mD2dCdGPbMcHXAZKv4CjIuONh8RnKpYo-IdK5ga8AZYbdg7Ia88SPFKTZoWU3xyLqTpixHihEcxn3w7bMl',
    },
    {
      id: 'completed-2',
      serviceTitle: 'Plumbing Repair',
      customerName: 'Arjun Menon',
      date: 'Aug 22, 2026',
      amount: '₹850',
      customerAvatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAw5E2J0TYCpOjYTFmX5l_elMrE9amWkD5UWilADTU3LGsl9G08-ZUp6yfdaKZQ-zC9nxYzyo56xJno2a4XZf949nhiBxbJLMWIQ1mlbG8DnLyag4k1Uag8HL4qigtEVCIWEOzFSujcvhVVGDFZlgxGwZhmZWI70ak_UEJ-XPeYofZ9ikF6RzCklsOGKpv5qEEh928kiV8PN7VzGHrt-UDpAUUqg7KmCwOMc0YXj0dVWk8rhpJx5cCt',
    },
    {
      id: 'completed-3',
      serviceTitle: 'Fan Installation',
      customerName: 'Anjali Thomas',
      date: 'Aug 19, 2026',
      amount: '₹600',
      customerAvatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD8_Bc_jF6m2gNq5REy_FIUVDXpcJPzQ6aZDWoCUIdjEfdOQqnUVfwevlhrar2ONh96WswkXfzCY0F38Anqz6EAZiKtJRdkoneVbP-NDOKQ-qSO2w6k9kwu3awI73-3Bp3Trgxaxzb3_H3-wz2o4iobPsLF2DWFmWj1PRDLQzu4axTBSmw9zoMXYLwoTYyxYvhcw_AJp3Bj8T-wjy9zenvZIMwnea-5vnrSyGnABiq8iI6H0fbjMUjO',
    },
    {
      id: 'completed-4',
      serviceTitle: 'AC Maintenance',
      customerName: 'Priya Sharma',
      date: 'Aug 15, 2026',
      amount: '₹1,500',
      customerAvatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAClpkYoBqDNkCEfBawIaS_f43NwBT6iuQrBJgXRfqUAArByKqYpBqRaavAyR0sSXuT6zSvCW0rpqqo2gqV8PbaXQsINoUmmd_iT2FbqZNBBqqXeu_e70ZqT8-0gYyflVRPU_TUnpp79O2j0BoQ2hKukVkgHfh2wskiRoGuVA-VefykAC9TeCZSr5uTHXXMGd7YDpG0pF3Ad1BeqX5F91TCEnabJ58vqlJgQ4RTKwsqf7clUMtrO2E',
    },
  ];
}
