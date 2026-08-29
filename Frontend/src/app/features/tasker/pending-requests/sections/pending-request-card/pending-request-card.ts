import { Component, input } from '@angular/core';

export interface PendingRequestItem {
  id: string;
  serviceTitle: string;
  serviceIcon: string;
  customerName: string;
  customerAvatar: string;
  status: string;
  appointmentDateTime: string;
  duration: string;
  location: string;
  price: string;
  requestedTime: string;
}

@Component({
  selector: 'app-pending-request-card',
  imports: [],
  templateUrl: './pending-request-card.html',
  styleUrl: './pending-request-card.css',
})
export class PendingRequestCard {
  readonly request = input<PendingRequestItem>({
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
  });
}
