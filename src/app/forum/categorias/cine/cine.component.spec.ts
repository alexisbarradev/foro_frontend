import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CineComponent } from './cine.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { environment } from '../../../../environments/environments';

class MockUserService {
  isAdmin() {
    return false;
  }
  getUsername() {
    return 'TestUser';
  }
}

describe('CineComponent', () => {
  let component: CineComponent;
  let fixture: ComponentFixture<CineComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule, CineComponent],
      providers: [{ provide: UserService, useClass: MockUserService }]
    }).compileComponents();

    fixture = TestBed.createComponent(CineComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch topics and initialize comment forms', () => {
    const mockTopics = [
      { id: 1, title: 'Tema 1', author: 'TestUser', createdAt: new Date() }
    ];
    const mockComments = [
      { id: 1, text: 'Comentario', author: 'TestUser' }
    ];

    fixture.detectChanges(); // Triggers ngOnInit

    const topicsReq = httpMock.expectOne(`${environment.apiUrl}/topics/by-category/PELICULAS`);
    expect(topicsReq.request.method).toBe('GET');
    topicsReq.flush(mockTopics);

    const commentsReq = httpMock.expectOne(`${environment.apiUrl}/topics/1/comments`);
    expect(commentsReq.request.method).toBe('GET');
    commentsReq.flush(mockComments);

    expect(component.topics.length).toBe(1);
    expect(component.commentForms[1]).toBeDefined();
    expect(component.commentsMap[1].length).toBe(1);
  });

  it('should send a comment', () => {
    // Precondiciones
    const topicId = 1;
    component.commentForms[topicId] = component['fb'].group({ text: ['Hola mundo'] });

    const mockComment = { text: 'Hola mundo', author: 'TestUser' };

    component.enviarComentario(topicId);

    const req = httpMock.expectOne(`${environment.apiUrl}/topics/${topicId}/comments`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockComment);

    req.flush({}); // Simula respuesta exitosa

    const refreshReq = httpMock.expectOne(`${environment.apiUrl}/topics/${topicId}/comments`);
    expect(refreshReq.request.method).toBe('GET');
    refreshReq.flush([]);
  });
});
