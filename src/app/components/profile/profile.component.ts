import { Component, OnInit } from '@angular/core';
import { debounceTime, Subject, switchMap } from 'rxjs';
import { ToastEvent } from 'src/app/constants/toast';
import { AppuserData } from 'src/app/models/appuserdata';
import { AppuserService } from 'src/app/services/appuser/appuser.service';
import { ToastService } from 'src/app/services/toast/toast.service';
declare var bootstrap: any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  appUserData?: AppuserData;
  constructor(
    private appUserService: AppuserService,
    private toastService: ToastService
  ) {}
  isKeyVisible: boolean = false;
  showAPIKey: boolean = false;
  showUserProfile: boolean = false;

  get maskedApiKey(): string {
    return this.appUserData?.apiKey?.replace(/.(?=.{4})/g, '*') || '';
  }

  toggleApiKeyVisibility(): void {
    this.isKeyVisible = !this.isKeyVisible;
  }

  ngOnInit(): void {
    this.appUserService.fetchAppuserData().subscribe((data) => {
      this.appUserData = data;
      this.showUserProfile = true;
      this.showAPIKey = true;
    });
    var tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  createApiKeyForUser() {
    this.appUserService.createApiKey().subscribe((response) => {
      this.toastService.show(
        this.toastService.createToast(response.message, ToastEvent.Success)
      );
      if (response.success) {
        setTimeout(() => window.location.reload(), 1500);
      }
    });
  }

  updateApiKey() {
    this.appUserService.updateApiKey().subscribe((response) => {
      this.toastService.show(
        this.toastService.createToast(response.message, ToastEvent.Success)
      );
      if (response.success) {
        setTimeout(() => window.location.reload(), 1200);
      }
    });
  }

  copyToClipboard() {
    const apiKey = this.appUserData?.apiKey || '';
    const textArea = document.createElement('textarea');
    textArea.value = apiKey;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    this.toastService.show(
      this.toastService.createToast(
        'API Key copied to clipboard!',
        ToastEvent.Info
      )
    );
  }
}
