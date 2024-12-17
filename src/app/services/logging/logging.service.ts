import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  private readonly environment = environment;
  constructor() {}

  log(message: any, ...optionalParams: any[]): void {
    this.executeIfAllowed(
      () => console.log(message, optionalParams),
      environment.production
    );
  }
  error(message: any, ...optionalParams: any[]): void {
    this.executeIfAllowed(
      () => console.error(message, optionalParams),
      environment.production
    );
  }

  info(message: any, ...optionalParams: any[]): void {
    this.executeIfAllowed(
      () => console.info(message, optionalParams),
      environment.production
    );
  }

  table(tabularData: any, properties?: Array<string>): void {
    this.executeIfAllowed(
      () => console.table(tabularData, properties),
      environment.production
    );
  }
  time(label?: string): void {
    this.executeIfAllowed(() => console.time(label), environment.production);
  }
  timeLog(label?: string, ...data: any[]): void {
    this.executeIfAllowed(
      () => console.timeLog(label, data),
      environment.production
    );
  }
  trace(message?: any, ...optionalParams: any[]): void {
    this.executeIfAllowed(
      () => console.trace(message, ...optionalParams),
      environment.production
    );
  }

  executeIfAllowed(action: () => void, isProduction: boolean): void {
    if (!isProduction) {
      action();
    }
  }
}
