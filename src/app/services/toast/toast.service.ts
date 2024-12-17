import { Injectable } from '@angular/core';
import { Toast, ToastEvent } from 'src/app/constants/toast';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts: Toast[] = [];

  createToast(
    body: string,
    event?: ToastEvent,
    delay?: number,
    timerInSeconds?: number,
    timer?: number
  ): Toast {
    const toastDelay = delay ?? 0;
    const toastTimerInSeconds = timerInSeconds ?? 2.5;
    const toastTimer = timer ?? 0;
    const toastEvent = event ?? ToastEvent.Info;

    return {
      body,
      delay: toastDelay,
      timerInSeconds: toastTimerInSeconds,
      timer: toastTimer,
      event: toastEvent,
    };
  }

  show(toast: Toast) {
    this.toasts.push(toast);
    this.startTimer(toast);
  }

  startTimer(toast: Toast) {
    toast.timer = window.setTimeout(
      () => this.remove(toast),
      toast.timerInSeconds! * 1000
    );
  }

  remove(toast: Toast) {
    if (toast.timer !== undefined) {
      window.clearTimeout(toast.timer);
    }
    this.toasts = this.toasts.filter((t) => t !== toast);
  }
}
