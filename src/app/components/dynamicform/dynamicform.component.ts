import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { InputRequirement } from 'src/app/models/analyticsget';
import { DynamicformService } from 'src/app/services/dynamicform/dynamicform.service';

@Component({
  selector: 'app-dynamicform',
  templateUrl: './dynamicform.component.html',
  styleUrls: ['./dynamicform.component.css'],
})
export class DynamicformComponent implements OnInit, OnDestroy {
  @Input() inputRequirements: InputRequirement[] = [];
  @Output() formDataSubmit = new EventEmitter<any>();
  form: FormGroup = this.fb.group({});
  private subscription!: Subscription;
  constructor(
    private fb: FormBuilder,
    private dynamicFormService: DynamicformService
  ) {}

  ngOnInit(): void {
    this.subscription = this.dynamicFormService.inputRequirements$.subscribe(
      (requirements) => {
        if (requirements) {
          this.inputRequirements = requirements;
          this.updateForm();
        }
      }
    );
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['inputRequirements']) {
      this.updateForm();
    }
  }

  private updateForm(): void {
    if (!this.inputRequirements || this.inputRequirements.length === 0) {
      return;
    }

    const controls = this.inputRequirements.reduce((acc, input) => {
      acc[input.key] = [null, Validators.required];
      return acc;
    }, {} as Record<string, any>);
    this.form = this.fb.group(controls);
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.formDataSubmit.emit(this.form.value);
    } else {
      console.error('Form is invalid');
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
