import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '../users/model/user.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);

    // Simula un token en localStorage con username y role válidos
    localStorage.setItem(
      'token',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
      'eyJzdWIiOiJ1c3VhcmlvVGVzdCIsInJvbGUiOiJhZG1pbiJ9.' +
      'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    );
  });

  afterEach(() => {
    localStorage.clear();
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return username from token', () => {
    const username = service.getUsername();
    expect(username).toBe('usuarioTest');
  });

  it('should return role from token', () => {
    const role = service.getRole();
    expect(role).toBe('admin');
  });

  it('should identify admin role correctly', () => {
    expect(service.isAdmin()).toBeTrue();
  });

  it('should call getAllUsers and return an array', () => {
    const dummyUsers: User[] = [
      { id: 1, username: 'Juan', email: 'juan@mail.com' }
    ];

    service.getAllUsers().subscribe(users => {
      expect(users.length).toBe(1);
      expect(users[0].username).toBe('Juan');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);
  });

  it('should call deleteUser and return void', () => {
    service.deleteUser(1).subscribe(res => {
      expect(res).toBeNull(); // ✅ Cambiado de undefined a null
    });

    const req = httpMock.expectOne('http://localhost:8080/api/users/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null); // ✅ Simula respuesta vacía
  });
});
