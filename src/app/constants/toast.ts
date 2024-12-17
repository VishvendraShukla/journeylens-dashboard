export interface Toast {
  body: string;
  delay?: number | 0;
  timerInSeconds?: number;
  timer?: number;
  event?: ToastEvent;
}

export enum ToastEvent {
  Primary = 'bg-primary',
  Secondary = 'bg-secondary',
  Success = 'bg-success',
  Danger = 'bg-danger',
  Warning = 'bg-warning',
  Info = 'bg-info',
  Light = 'bg-light',
  Dark = 'bg-dark',
}
