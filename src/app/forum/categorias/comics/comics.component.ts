import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-comics',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  styleUrls: ['./comics.component.css'],
  template: `
    <!-- Banner tipo carrusel horizontal -->
    <div class="slider-wrapper">
      <div class="comics-hero-content">
        <h1>COMICS</h1>
        <p>Explora y comenta sobre tus historias gráficas favoritas. Desde DC y Marvel, hasta los independientes y más radicales como IDW, DARKHORSE e IMAGE.</p>
      </div>
      <div class="slider-track">
        <img src="assets/marvelcomics.jpg" alt="Marvel">
        <img src="assets/dc.jpg" alt="DC">
        <img src="assets/spawn.jpg" alt="Spawn">
        <img src="assets/Greengoblin.jpg" alt="Green Goblin">
        <img src="assets/mk.jpg" alt="Mortal Kombat">
        <img src="assets/redsonja.jpg" alt="Red Sonja">
        <img src="assets/marvelcomics.jpg" alt="Marvel-copy">
        <img src="assets/dc.jpg" alt="DC-copy">
        <img src="assets/spawn.jpg" alt="Spawn-copy">
        <img src="assets/Greengoblin.jpg" alt="Green Goblin-copy">
        <img src="assets/mk.jpg" alt="Mortal Kombat-copy">
        <img src="assets/redsonja.jpg" alt="Red Sonja-copy">
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
          <input class="form-control" [value]="author" disabled>
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
            <td>
              {{ topic.title }}
              <br>
              <button class="btn btn-sm btn-outline-info mt-2" (click)="toggleComentarios(topic.id)">
                {{ mostrarComentarios[topic.id] ? 'Ocultar' : 'Ver' }} comentarios
              </button>

              <div *ngIf="mostrarComentarios[topic.id]">
                <ul class="list-group mt-2" *ngIf="commentsMap[topic.id]?.length">
                  <li class="list-group-item" *ngFor="let c of commentsMap[topic.id]">
                    <strong>{{ c.author }}</strong>: {{ c.text }}
                  </li>
                </ul>
                <p *ngIf="!commentsMap[topic.id]?.length" class="text-muted">No hay comentarios.</p>

                <form [formGroup]="commentForms[topic.id]" (ngSubmit)="enviarComentario(topic.id)" class="mt-2">
                  <div class="input-group">
                    <input type="text" class="form-control" placeholder="Escribe un comentario..." formControlName="text">
                    <button class="btn btn-outline-success" type="submit" [disabled]="commentForms[topic.id].invalid">
                      Enviar
                    </button>
                  </div>
                </form>
              </div>
            </td>
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
export class ComicsComponent implements OnInit {
  private readonly API_BASE = 'http://localhost:8081/api';
  topics: any[] = [];
  topicForm: FormGroup;
  commentForms: { [key: number]: FormGroup } = {};
  commentsMap: { [key: number]: any[] } = {};
  mostrarComentarios: { [key: number]: boolean } = {};
  mostrarFormulario = false;
  esAdmin = false;
  author = '';

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

  ngOnInit(): void {
    this.esAdmin = this.userService.isAdmin();
    this.author = this.userService.getUsername();
    this.obtenerTopics();
  }

  obtenerTopics(): void {
    this.http.get<any[]>(`${this.API_BASE}/topics/by-category/COMICS`).subscribe({
      next: data => {
        this.topics = data;
        this.topics.forEach(topic => {
          this.commentForms[topic.id] = this.fb.group({
            text: ['', Validators.required]
          });
          this.obtenerComentarios(topic.id);
        });
      },
      error: err => console.error('❌ Error al cargar tópicos:', err)
    });
  }

  onSubmit(): void {
    if (this.topicForm.invalid) return;

    const newTopic = {
      ...this.topicForm.value,
      author: this.userService.getUsername()
    };

    this.http.post(`${this.API_BASE}/topics/create?categoryId=1`, newTopic, {
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

  eliminarTema(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este tema?')) {
      this.http.delete(`${this.API_BASE}/topics/delete/${id}`).subscribe({
        next: () => this.obtenerTopics(),
        error: err => console.error('❌ Error al borrar tópico:', err)
      });
    }
  }

  toggleComentarios(topicId: number): void {
    this.mostrarComentarios[topicId] = !this.mostrarComentarios[topicId];
  }

  obtenerComentarios(topicId: number): void {
    this.http.get<any[]>(`${this.API_BASE}/topics/${topicId}/comments`)
      .subscribe({
        next: data => this.commentsMap[topicId] = data,
        error: err => console.error(`❌ Error al obtener comentarios del topic ${topicId}:`, err)
      });
  }

  enviarComentario(topicId: number): void {
    const form = this.commentForms[topicId];
    if (form.invalid) return;

    const newComment = {
      text: form.value.text,
      author: this.userService.getUsername()
    };

    this.http.post(`${this.API_BASE}/topics/${topicId}/comments`, newComment).subscribe({
      next: () => {
        form.reset();
        this.obtenerComentarios(topicId);
      },
      error: err => console.error(`❌ Error al enviar comentario para topic ${topicId}:`, err)
    });
  }
}

