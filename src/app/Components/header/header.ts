import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  currentDate: Date = new Date();

  constructor(private router: Router) { }

  logout(): void {
    console.log('Logout clicked');
    this.router.navigate(['/login']);
  }
}
