import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthFacade } from './auth.facade';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service'; // Asegúrate de importar esto

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError = false;

  constructor(
    private fb: FormBuilder,
    private authFacade: AuthFacade,
    private router: Router,
    private userService: UserService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      console.warn('⚠️ Formulario inválido');
      return;
    }

    const { username, password } = this.loginForm.value;
    console.log('📤 Enviando login con:', { username, password });

    this.authFacade.login(username, password).subscribe({
      next: (token) => {
        this.loginError = false;

        // ✅ Guarda el token en localStorage
      localStorage.setItem('token', token);

        // 🔁 Actualiza el servicio del usuario antes de navegar
        this.userService.setToken(token);

        console.log('✅ Login exitoso. Navegando a /forum con nuevo usuario');
        this.router.navigate(['/forum']);
      },
      error: (err) => {
        console.error('❌ Login fallido:', err);
        this.loginError = true;
      }
    });
  }
}
