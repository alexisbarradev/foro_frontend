import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-videojuegos',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  styleUrls: ['./videojuegos.component.css'],
  template: `
    <div class="slider-wrapper">
      <div class="videojuegos-hero-content">
        <h1>VIDEOJUEGOS</h1>
        <p>Comparte y comenta sobre tus juegos favoritos, desde los clásicos retro hasta los lanzamientos más recientes.</p>
      </div>

      <div class="slider-track">
        <img src="assets/chunli.jpg" alt="Chun-Li">
        <img src="assets/doom.jpg" alt="Doom">
        <img src="assets/gaiden.jpg" alt="Ninja Gaiden">
        <img src="assets/mortal.jpg" alt="Mortal Kombat">
        <img src="assets/tmnt.jpg" alt="TMNT">
        <img src="assets/halo.jpg" alt="Halo">
        <img src="assets/chunli.jpg" alt="Chun-Li Copy">
        <img src="assets/doom.jpg" alt="Doom Copy">
        <img src="assets/gaiden.jpg" alt="Ninja Gaiden Copy">
        <img src="assets/mortal.jpg" alt="Mortal Kombat Copy">
        <img src="assets/tmnt.jpg" alt="TMNT Copy">
        <img src="assets/halo.jpg" alt="Halo Copy">
        <img src="assets/chunli.jpg" alt="Chun-Li Copy 2">
        <img src="assets/doom.jpg" alt="Doom Copy 2">
        <img src="assets/gaiden.jpg" alt="Ninja Gaiden Copy 2">
        <img src="assets/mortal.jpg" alt="Mortal Kombat Copy 2">
        <img src="assets/tmnt.jpg" alt="TMNT Copy 2">
        <img src="assets/halo.jpg" alt="Halo Copy 2">
      </div>
    </div>

    <div class="container mt-4">
      <button class="btn btn-primary mb-3" (click)="mostrarFormulario = !mostrarFormulario">
        {{ mostrarFormulario ? 'Cancelar' : 'Abrir Tema' }}
      </button>

      <form *ngIf="mostrarFormulario" [formGroup]="topicForm" (ngSubmit)="onSubmit()" class="card p-3 mb-3">
        <div class="mb-3">
          <label for="title" class="form-label">Título</label>
          <input id="title" class="form-control" formControlName="title">
        </div>
        <div class="mb-3">
          <label for="content" class="form-label">Contenido</label>
          <textarea id="content" class="form-control" formControlName="content"></textarea>
        </div>
        <div class="mb-3">
          <label class="form-label">Autor</label>
          <input class="form-control" [value]="userService.getUsername()" disabled>
        </div>
        <button type="submit" class="btn btn-success" [disabled]="topicForm.invalid">Publicar</button>
      </form>

      <table class="table table-bordered table-striped mt-3" *ngIf="topics.length > 0">
        <thead class="table-dark">
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>Fecha</th>
            <th *ngIf="esAdmin">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let topic of topics">
            <td>{{ topic.title }}</td>
            <td>{{ topic.author }}</td>
            <td>{{ topic.createdAt | date:'short' }}</td>
            <td *ngIf="esAdmin">
              <button class="btn btn-danger btn-sm" (click)="eliminarTema(topic.id)">Borrar</button>
            </td>
          </tr>
        </tbody>
      </table>

      <p *ngIf="topics.length === 0" class="text-muted">No hay temas aún.</p>
    </div>
  `
})
export class VideojuegosComponent implements OnInit {
  topics: any[] = [];
  topicForm: FormGroup;
  mostrarFormulario = false;
  esAdmin = false;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    public userService: UserService
  ) {
    this.topicForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.esAdmin = this.userService.isAdmin(); // Detecta si es admin
    this.obtenerTopics();
  }

  obtenerTopics() {
    this.http.get<any[]>('http://localhost:8081/api/topics/by-category/VIDEOJUEGOS')
      .subscribe(data => this.topics = data);
  }

  onSubmit() {
    if (this.topicForm.invalid) return;

    const newTopic = {
      ...this.topicForm.value,
      author: this.userService.getUsername()
    };

    this.http.post('http://localhost:8081/api/topics/create?categoryId=3', newTopic, {
      responseType: 'text'
    }).subscribe({
      next: () => {
        this.topicForm.reset();
        this.mostrarFormulario = false;
        this.obtenerTopics();
      },
      error: err => console.error('❌ Error al crear tópico:', err)
    });
  }

  eliminarTema(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este tema?')) {
      this.http.delete(`http://localhost:8081/api/topics/delete/${id}`)
        .subscribe({
          next: () => {
            console.log('🗑️ Tópico eliminado:', id);
            this.obtenerTopics();
          },
          error: err => console.error('❌ Error al borrar tópico:', err)
        });
    }
  }
}
