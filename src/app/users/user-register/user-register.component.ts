import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent {
  registerForm: FormGroup;
  registrationSuccess = false;
  registrationError = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['user', Validators.required] // o 'admin'
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    const newUser = this.registerForm.value;

    this.http.post('http://localhost:8080/api/users/register', newUser)
      .subscribe({
        next: () => {
          this.registrationSuccess = true;
          this.registrationError = false;
          this.registerForm.reset();
        },
        error: () => {
          this.registrationError = true;
          this.registrationSuccess = false;
        }
      });
  }
}
