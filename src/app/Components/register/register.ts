import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Auth } from '../../Services/auth';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private fb: FormBuilder, private auths: Auth, private router: Router) { }

  ngOnInit(): void {

    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      gender: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required],
      roleId: [3]  // ← number not string
    });
  }

  // ── Getters ──
  get username() { return this.registerForm.get('username'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get gender() { return this.registerForm.get('gender'); }
  get phone() { return this.registerForm.get('phone'); }
  get address() { return this.registerForm.get('address'); }

  onSubmit(): void {
    debugger;
    const formData = this.registerForm.value;
    if (this.registerForm.valid) {
      const payload = {
        Username: this.registerForm.value.username,
        Email: this.registerForm.value.email,
        Password: this.registerForm.value.password,
        Gender: this.registerForm.value.gender,
        Phone: this.registerForm.value.phone,
        Address: this.registerForm.value.address,
        RoleId: this.registerForm.value.roleId
      };

      console.log('Sending payload:', payload); // ← verify in console

      this.auths.register(payload).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.successMessage = 'Registered successfully! Redirecting...';
          this.errorMessage = '';
          setTimeout(() => this.router.navigate(['/login']), 1500); // redirect to login
        },
        error: (err: HttpErrorResponse) => {
          console.error('Registration failed:', err);
          console.log('Validation errors:', err.error?.errors); // ← see exact API errors

          // Show specific API error if available
          if (err.error?.errors) {
            const errors = err.error.errors;
            this.errorMessage = Object.values(errors).flat().join(', ') as string;
          } else if (err.error?.message) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = 'Registration failed. Please try again.';
          }
        }
      });

    } else {
      this.registerForm.markAllAsTouched(); // show all validation errors
    }
  }
}