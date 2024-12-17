import { Component, OnInit } from '@angular/core';
import { sidemenu } from 'src/app/constants/sidemenu';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  title = 'journeylens-dashboard';
  menus: any;
  constructor() {}
  ngOnInit(): void {
    this.menus = sidemenu;
  }
}