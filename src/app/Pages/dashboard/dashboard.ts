import { Component } from '@angular/core';
import { Layout } from "../../Components/layout/layout";
import { RouterOutlet } from '@angular/router';
import { Header } from "../../Components/header/header";

@Component({
  selector: 'app-dashboard',
  imports: [Layout, RouterOutlet, Header],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {


  isSidebarCollapsed = false;

  onToggleSidebar(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }
}
