import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { RouterModule } from '@angular/router';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  standalone: true,
  selector: 'app-register',

  imports: [
    ReactiveFormsModule,
    RouterModule,

    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
  ],

  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private fb = inject(FormBuilder);

  registerForm = this.fb.nonNullable.group({
    lastName: ['', Validators.required],
    firstName: ['', Validators.required],

    email: ['', [Validators.required, Validators.email]],

    company: ['', Validators.required],

    country: ['', Validators.required],

    field: ['', Validators.required],

    position: ['', Validators.required],

    purpose: ['', Validators.required],
  });

  get f() {
    return this.registerForm.controls;
  }

  submit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const value = this.registerForm.getRawValue();

    console.log('Register data:', value);
  }
}
