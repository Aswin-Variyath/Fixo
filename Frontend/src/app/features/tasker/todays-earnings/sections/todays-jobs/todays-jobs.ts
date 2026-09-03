import { Component } from '@angular/core';

interface TodaysJob {
  id: string;
  customerName: string;
  service: string;
  time: string;
  amount: string;
  avatar: string;
}

@Component({
  selector: 'app-todays-jobs',
  imports: [],
  templateUrl: './todays-jobs.html',
  styleUrl: './todays-jobs.css',
})
export class TodaysJobs {
  readonly jobs: TodaysJob[] = [
    { id: 'today-1', customerName: 'Rahul Nair', service: 'Electrical Wiring', time: '10:30 AM', amount: '₹1,200', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDi8Xr3SFgLO6AuvcyZ2RmqJ3bN_2nUch_DggWwieUd0HoSY07vs9A74Gd1ZNjC8MG8s51aDa6RRRCIsDe88yfM2tjsIJ13gEdUrrpxoORJQAV74GGGvAGaiwQgsqIW8syiGixbGuag30wvsk-9iPI8JiFQoJ_FJJLtmjT_mW07DT1ZT6Ce_Z25kLa_iciAFuPAV_K6A830X-3iPxGnCZNxsgI2g1K2J8PCl4nbPOl3TRkzKobgS1ch' },
    { id: 'today-2', customerName: 'Arjun Menon', service: 'Plumbing Repair', time: '12:15 PM', amount: '₹650', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdZfau7gVqzb9qN72HFb7ugWdonFyzxM26gZ0mf9T2UyxCj8gR8yOIgPI3TyRH6z596Cuqk2Bm4xmtliTN7Frq8x83gpkvz44tEoJLtW8FsNrS2pjMIeGOb3igw-sCNDacwByJK2Xl0GAl8nlAK-JzsbAIXuK31IdVR-R6dSva6pWOpq8SkbzzdDPVfWsk8fQURnsnFXWGWxnA91PmE7-ABe3c0QBuSzqkzDLAgk9sa3jppiqgCoHS' },
    { id: 'today-3', customerName: 'Anjali Thomas', service: 'Fan Installation', time: '3:00 PM', amount: '₹450', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaF12bvA2HyRaAEDPFUcGbTtQCBQyj-VUxNKEfb42NhZXLTUVNf0lBa3lKjhrBiHR7xlBJ-aW7yYtzdS3swOw0jSLef2sK5hCwJHt9-65mGcHqd6NmHDb4-yqvkyPMVsjHrTwHS2aLkqNq3TChSFjqy5itsAIByM6XIN9laEnU6DN87Ze2fEd4MvJHzk8PnC8kPwPPCR3wWn2Gn8g_wZJKXVei7Frh7hAtGNcbvL12VivTqt1OsHic' },
    { id: 'today-4', customerName: 'Vishnu Kumar', service: 'Switchboard Repair', time: '5:20 PM', amount: '₹350', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqJ8XrtiNi1nZof7qqYzbxN82Zl5zVdAdZCnjGd2It0CMlSbVXHJUEMSpi6mSpNxg5zxx1vQaGYCt7pAT0q1aEefAeofufoIGYTS8ptgcJc0uz8ghtzl9fKewaUSpgLOW3PAn_1LDs9ICAAcOQLw7SFlMFO4mRtfwNXnHbp5RQYSHy07kyle3PESyxkODWY5qwTU1KWjXB6K6Fv__fZPrfUvTrc1Mh41v69oWafPoW_4N8FaWonvKb' },
  ];
}
