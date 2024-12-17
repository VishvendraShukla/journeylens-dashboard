import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastEvent } from 'src/app/constants/toast';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showSpinner = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((response) => {
      if (response) {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['']);
      }
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.showSpinner = true;
      this.authService
        .login(this.loginForm.value.email, this.loginForm.value.password)
        .subscribe({
          next: (success) => {
            this.showSpinner = false;
            if (success) {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['']);
            }
          },
          error: (error) => {
            console.error('Login error:', error);
            this.toastService.show(
              this.toastService.createToast(
                error.error.message,
                ToastEvent.Danger
              )
            );
            this.router.navigate(['']);
          },
        });
    } else {
      this.toastService.show(
        this.toastService.createToast(
          'Form is invalid. Please check your inputs.',
          ToastEvent.Danger
        )
      );
      this.showSpinner = false;
      this.router.navigate(['']);
    }
  }
}
