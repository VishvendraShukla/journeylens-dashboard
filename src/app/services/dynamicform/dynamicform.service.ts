import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { InputRequirement } from 'src/app/models/analyticsget';

@Injectable({
  providedIn: 'root',
})
export class DynamicformService {
  private inputRequirementsSource = new BehaviorSubject<any>([]);
  inputRequirements$ = this.inputRequirementsSource.asObservable();

  constructor() {}

  setInputRequirements(inputRequirements: any) {
    this.inputRequirementsSource.next(inputRequirements);
  }
}
