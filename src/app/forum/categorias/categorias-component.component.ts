import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, HttpClientModule], // ✅ necesario para que HttpClient funcione
  template: `
    <div class="container mt-4">
      <h2>Categorías del foro</h2>
      <ul class="list-group">
        <li class="list-group-item"
            *ngFor="let categoria of categorias">
          {{ categoria.name }}
        </li>
      </ul>
    </div>
  `
})
export class CategoriasComponent implements OnInit {
  categorias: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:8081/api/categories')
      .subscribe(data => {
        this.categorias = data;
      });
  }
}
