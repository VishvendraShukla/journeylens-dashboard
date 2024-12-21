import { NgModule } from '@angular/core';
import { UserManagementComponent } from '../user-management/user-management.component';
import { HomeComponent } from './home.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeRoutingModule } from './home-routing.module';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { DashboardHomeComponent } from '../dashboard-home/dashboard-home.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ProfileComponent } from '../profile/profile.component';
import { DynamicformComponent } from '../dynamicform/dynamicform.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from '../spinner/spinner.component';
import { SessionComponent } from '../session/session.component';
import { EventtypeComponent } from '../eventtype/eventtype.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    UserManagementComponent,
    DashboardHomeComponent,
    ProfileComponent,
    DynamicformComponent,
    SpinnerComponent,
    SessionComponent,
    EventtypeComponent,
  ],
  imports: [
    CommonModule,
    NgApexchartsModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  exports: [SpinnerComponent, DynamicformComponent],
})
export class HomeModule {}
