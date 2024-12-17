import { Component, OnInit } from '@angular/core';
import { ToastEvent } from 'src/app/constants/toast';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-signout',
  template: `<h1>Signing Out!</h1>`,
  styleUrls: ['./signout.component.css'],
})
export class SignoutComponent implements OnInit {
  constructor(
    private authenticationService: AuthenticationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.toastService.show(
      this.toastService.createToast('Signing out.', ToastEvent.Warning)
    );
    this.authenticationService.logout();
  }
}
