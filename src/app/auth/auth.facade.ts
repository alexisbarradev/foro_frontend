import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UserService } from '../services/user.service'; // ajusta la ruta si es necesario

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  private apiUrl = 'http://localhost:8080/api/users'; // tu endpoint actual

  constructor(
    private http: HttpClient,
    private userService: UserService // 🔁 inyectamos el servicio
  ) {}

  login(username: string, password: string): Observable<any> {
    const loginData = { username, password };

    return this.http.post(`${this.apiUrl}/login`, loginData, { responseType: 'text' }).pipe(
      tap(token => {
        localStorage.removeItem('token');             // 🔁 Limpia token anterior
        localStorage.setItem('token', token);         // ✅ Guarda nuevo token
        this.userService.setToken(token);             // 🧠 Actualiza el usuario actual
        console.log('🔐 Nuevo token guardado y decodificado:', token);
      })
    );
  }
}
