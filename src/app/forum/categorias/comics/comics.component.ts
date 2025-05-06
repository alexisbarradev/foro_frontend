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
export class ComicsComponent implements OnInit {
  topics: any[] = [];
  topicForm: FormGroup;
  mostrarFormulario = false;
  esAdmin = false;
  author: string = '';

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
    this.esAdmin = this.userService.isAdmin();
    this.author = this.userService.getUsername();
    this.obtenerTopics();
  }

  obtenerTopics() {
    this.http.get<any[]>('http://localhost:8081/api/topics/by-category/COMICS')
      .subscribe({
        next: data => this.topics = data,
        error: err => console.error('❌ Error al cargar tópicos:', err)
      });
  }

  onSubmit() {
    if (this.topicForm.invalid) return;

    const newTopic = {
      ...this.topicForm.value,
      author: this.userService.getUsername()
    };

    this.http.post('http://localhost:8081/api/topics/create?categoryId=1', newTopic, {
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
