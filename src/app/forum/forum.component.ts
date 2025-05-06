import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserService } from '../services/user.service'; // ✅

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, HttpClientModule],
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {
  categories: any[] = [];
  username: string = '';
  role: string = '';

  constructor(private http: HttpClient, private userService: UserService) {}

  ngOnInit(): void {
    this.username = this.userService.getUsername();
    this.role = this.userService.getRole();

    this.http.get<any[]>('http://localhost:8081/api/categories')
      .subscribe({
        next: data => this.categories = data,
        error: err => console.error('Error al cargar categorías', err)
      });
  }

  // ✅ Método para saber si es admin
  isAdmin(): boolean {
    return this.userService.isAdmin();
  }
}
