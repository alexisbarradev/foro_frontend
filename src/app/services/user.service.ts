import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../users/model/user.model'; 

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private token: string | null = null;
  private decoded: any = null;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token');
    if (this.token) {
      try {
        this.decoded = jwtDecode(this.token);
        console.log('🔍 TOKEN DECODIFICADO:', this.decoded);
      } catch (error) {
        console.error('❌ Invalid token:', error);
      }
    }
  }

  // ✅ NUEVA VERSIÓN: Lee siempre desde localStorage y decodifica en tiempo real
  getUsername(): string {
  const currentToken = localStorage.getItem('token'); // ✅ leer siempre la versión más actual
  if (currentToken) {
    try {
      const decoded: any = jwtDecode(currentToken);
      return decoded?.sub || 'Anónimo';
    } catch (err) {
      return 'Anónimo';
    }
  }
  return 'Anónimo';
}


  // 🔒 OPCIONAL: Mantén el anterior comentado por si necesitas volver
  /*
  getUsername(): string {
    return this.decoded?.sub || 'Anónimo';
  }
  */

  getRole(): string {
    const token = localStorage.getItem('token');
    if (!token) return '';
    try {
      const decoded: any = jwtDecode(token);
      return decoded?.role || '';
    } catch (err) {
      return '';
    }
  }

  // También ajustado para usar el método corregido
  isAdmin(): boolean {
    return this.getRole().toLowerCase() === 'admin';
  }

  // ✅ Nueva versión: accede directamente a localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // 🔒 Antiguo método comentado:
  /*
  getToken(): string | null {
    return this.token;
  }
  */

  // Se puede dejar igual
  setToken(newToken: string) {
    this.token = newToken;
    localStorage.setItem('token', newToken);
    try {
      this.decoded = jwtDecode(newToken);
      console.log('🔁 Token actualizado:', this.decoded);
    } catch (error) {
      console.error('❌ Error al decodificar nuevo token:', error);
      this.decoded = null;
    }
  }

  getAllUsers(): Observable<User[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`
    });
    return this.http.get<User[]>('http://localhost:8080/api/users', { headers });
  }

  deleteUser(id: number): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`
    });
    return this.http.delete<void>(`http://localhost:8080/api/users/${id}`, { headers });
  }
}
