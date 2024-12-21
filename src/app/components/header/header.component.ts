import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor() {}
  @Output() sidebarToggle = new EventEmitter<any>();
  isSidebarCollapsed: boolean = false;

  currentIcon = 'bi-chevron-bar-left';

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    if (this.isSidebarCollapsed) {
      this.currentIcon = 'bi-chevron-bar-right';
    } else {
      this.currentIcon = 'bi-chevron-bar-left';
    }
    this.sidebarToggle.emit(this.isSidebarCollapsed);
  }

  ngOnInit(): void {}
}
