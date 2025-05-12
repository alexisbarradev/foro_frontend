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
        <!-- Repetidos omitidos para brevedad -->
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
export class VideojuegosComponent implements OnInit {
  topics: any[] = [];
  topicForm: FormGroup;
  mostrarFormulario = false;
  esAdmin = false;
  commentForms: { [key: number]: FormGroup } = {};
  commentsMap: { [key: number]: any[] } = {};
  mostrarComentarios: { [key: number]: boolean } = {};

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
    this.obtenerTopics();
  }

  obtenerTopics() {
    this.http.get<any[]>('http://localhost:8081/api/topics/by-category/VIDEOJUEGOS')
      .subscribe(data => {
        this.topics = data;
        this.topics.forEach(topic => {
          this.commentForms[topic.id] = this.fb.group({ text: ['', Validators.required] });
          this.obtenerComentarios(topic.id);
        });
      });
  }

  onSubmit() {
    if (this.topicForm.invalid) return;

    const newTopic = {
      ...this.topicForm.value,
      author: this.userService.getUsername()
    };

    this.http.post('http://localhost:8081/api/topics/create?categoryId=3', newTopic, {
      responseType: 'text'
    }).subscribe(() => {
      this.topicForm.reset();
      this.mostrarFormulario = false;
      this.obtenerTopics();
    });
  }

  eliminarTema(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este tema?')) {
      this.http.delete(`http://localhost:8081/api/topics/delete/${id}`).subscribe(() => {
        this.obtenerTopics();
      });
    }
  }

  obtenerComentarios(topicId: number) {
    this.http.get<any[]>(`http://localhost:8081/api/topics/${topicId}/comments`)
      .subscribe(data => this.commentsMap[topicId] = data);
  }

  enviarComentario(topicId: number) {
    const form = this.commentForms[topicId];
    if (form.invalid) return;

    const comment = {
      text: form.value.text,
      author: this.userService.getUsername()
    };

    this.http.post(`http://localhost:8081/api/topics/${topicId}/comments`, comment).subscribe(() => {
      form.reset();
      this.obtenerComentarios(topicId);
    });
  }

  toggleComentarios(topicId: number) {
    this.mostrarComentarios[topicId] = !this.mostrarComentarios[topicId];
  }
}
