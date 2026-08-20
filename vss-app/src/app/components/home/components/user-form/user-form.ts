import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  OnChanges,
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { CommonModule } from '@angular/common';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,

    // NG-ZORRO
    NzFormModule,
    NzInputModule,
    NzButtonModule,
  ],

  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() visible = false;
  @Input() user: User | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<User>();

  form = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    avatar: [''],
  });

  ngOnChanges(): void {
    if (this.user) {
      this.form.patchValue(this.user);
    } else {
      this.form.reset();
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    this.save.emit({
      id: this.user?.id ?? 0,
      first_name: value.first_name ?? '',
      last_name: value.last_name ?? '',
      email: value.email ?? '',
      avatar: value.avatar ?? '',
    });
  }
}