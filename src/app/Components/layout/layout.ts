import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [RouterLink],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  isCollapsed = false;
  isOpen = false;


  toggleSidebar() {
    if (window.innerWidth <= 768) {
      this.isOpen = !this.isOpen;
    } else {
      this.isCollapsed = !this.isCollapsed;
    }
  }

  closeSidebar() {
    this.isOpen = false;
  }


}
