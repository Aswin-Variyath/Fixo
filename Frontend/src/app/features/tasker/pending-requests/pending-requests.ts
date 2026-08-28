import { Component, signal } from '@angular/core';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { Footer } from '../../../shared/components/footer/footer';
import { PendingRequestsHeader } from './sections/pending-requests-header/pending-requests-header';
import { PendingRequestsToolbar } from './sections/pending-requests-toolbar/pending-requests-toolbar';
import { PendingRequestCard, PendingRequestItem } from './sections/pending-request-card/pending-request-card';
import { PendingRequestsEmpty } from './sections/pending-requests-empty/pending-requests-empty';

@Component({
  selector: 'app-pending-requests',
  imports: [
    Navbar,
    Footer,
    PendingRequestsHeader,
    PendingRequestsToolbar,
    PendingRequestCard,
    PendingRequestsEmpty,
  ],
  templateUrl: './pending-requests.html',
  styleUrl: './pending-requests.css',
})
export class PendingRequests {
  // State toggle for visual preview between Empty (true) and List (false)
  readonly isEmptyState = signal<boolean>(true);

  // Mock items from Stitch reference
  readonly card1: PendingRequestItem = {
    id: '1',
    serviceTitle: 'Electrical Wiring',
    serviceIcon: 'electrical_services',
    customerName: 'Rahul Menon',
    customerAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBI55wzvrCOq9OtHOvzrXxmIzorPn3XjpLCPv1MVxG7fydJvinh19m8eQabWJh8TMTYmTE0V0j7OsAf4_wUghwBVE-auGNtprj6V_BFlMU-KpI25F9QM_PfTBw85RMKpQTPouH589ZL_SWF52IQZhZjoU1WRgF1ZfKCn69bhrr6Bx9o4REfAs5o4etAeMZ1KevkIxg-0tCHmiztfeNav86FybBokjtFX0O2mEjiyoMfSBWvnh5ikor0',
    status: 'PENDING REQUEST',
    appointmentDateTime: 'Aug 28, 2026 • 10:00 AM',
    duration: 'Est. 3 hours',
    location: 'Kozhikode, Kerala',
    price: '₹3,450',
    requestedTime: 'Requested 25 mins ago',
  };

  readonly card2: PendingRequestItem = {
    id: '2',
    serviceTitle: 'Pipe Leak Repair',
    serviceIcon: 'plumbing',
    customerName: 'Anjali Nair',
    customerAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBBmN1TsAxVKhShwn-TPlMxl4GFGhg8ENil39Zqn9yZSId9Xfwko0-2cmJGvVNbZQ6N1WEowANoOhdJ0gOnBLcSX7v-50APLACsnvRuouEdtFFvue0aRJBfUn4pUJPxMK-fZE-pxruckHkcOrNf7Uye7mn4n6fXWDpS1AXK6avdK3v0X8etAO_yMRv_QTkifv7wVuF0mAAeG9nltSIsxrtigkQYIKJ-3bORLuW8xTRDua9BMcgAJ92W',
    status: 'PENDING REQUEST',
    appointmentDateTime: 'Aug 28, 2026 • 02:00 PM',
    duration: 'Est. 1.5 hours',
    location: 'Wayanad, Kerala',
    price: '₹1,200',
    requestedTime: 'Requested 1 hr ago',
  };

  toggleState(): void {
    this.isEmptyState.update((v) => !v);
  }
}
