import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../not-found/not-found.component';
import { UserManagementComponent } from '../user-management/user-management.component';
import { HomeComponent } from './home.component';
import { DashboardHomeComponent } from '../dashboard-home/dashboard-home.component';
import { ProfileComponent } from '../profile/profile.component';
import { SignoutComponent } from '../signout/signout.component';
import { SessionComponent } from '../session/session.component';
import { EventtypeComponent } from '../eventtype/eventtype.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: DashboardHomeComponent },
      {
        path: 'user-management',
        component: UserManagementComponent,
      },
      {
        path: 'session',
        component: SessionComponent,
      },
      {
        path: 'event-type',
        component: EventtypeComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'signout',
        component: SignoutComponent,
      },
      {
        path: '**',
        component: NotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
