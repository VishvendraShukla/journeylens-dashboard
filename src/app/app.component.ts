import { Component, enableProdMode, OnInit } from '@angular/core';
import { sidemenu } from 'src/app/constants/sidemenu';
import { LoggingService } from './services/logging/logging.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'journeylens-dashboard';
  menus: any;
  constructor() {}
  ngOnInit(): void {
    this.menus = sidemenu;
  }
}
