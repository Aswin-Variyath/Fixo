import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-availability-header', imports: [RouterLink], templateUrl: './availability-header.html', styleUrl: './availability-header.css' })
export class AvailabilityHeader { readonly restricted = input(false); }
