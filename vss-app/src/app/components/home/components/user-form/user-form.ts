import { Component, EventEmitter, Input, Output, inject, OnChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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

  ngOnChanges() {
    if (this.user) {
      this.form.patchValue(this.user);
    } else {
      this.form.reset();
    }
  }

  submit() {
    if (this.form.invalid) return;

    this.save.emit({
      id: this.user?.id ?? Date.now(),
      ...this.form.getRawValue(),
    } as User);
  }
}
