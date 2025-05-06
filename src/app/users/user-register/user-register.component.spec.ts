import { ComponentFixture, TestBed, waitForAsync, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { UserRegisterComponent } from './user-register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('UserRegisterComponent', () => {
  let component: UserRegisterComponent;
  let fixture: ComponentFixture<UserRegisterComponent>;
  let httpMock: HttpTestingController;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        UserRegisterComponent // ✅ standalone
      ],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(UserRegisterComponent);
      component = fixture.componentInstance;
      httpMock = TestBed.inject(HttpTestingController);
      fixture.detectChanges();
    });
  }));

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.registerForm.valid).toBeFalse();
  });

  it('should validate required fields', () => {
    const form = component.registerForm;
    form.setValue({ username: '', password: '', role: '' });

    expect(form.get('username')?.hasError('required')).toBeTrue();
    expect(form.get('password')?.hasError('required')).toBeTrue();
    expect(form.get('role')?.hasError('required')).toBeTrue();
  });

  it('should validate password minLength', () => {
    const passwordControl = component.registerForm.get('password');
    passwordControl?.setValue('123');
    expect(passwordControl?.hasError('minlength')).toBeTrue();
  });

  it('should validate form when filled correctly', () => {
    component.registerForm.setValue({
      username: 'usuario',
      password: '123456',
      role: 'user'
    });
    expect(component.registerForm.valid).toBeTrue();
  });

  it('should submit form and set success flag', fakeAsync(() => { // Usamos fakeAsync
    component.registerForm.setValue({
      username: 'usuario',
      password: '123456',
      role: 'user'
    });

    component.onSubmit();

    const req = httpMock.expectOne('http://localhost:8080/api/users/register');
    expect(req.request.method).toBe('POST');
    req.flush({}); // respuesta simulada

    tick(); // Simula el paso del tiempo y resuelve promesas pendientes

    fixture.detectChanges(); // Aseguramos la detección de cambios ANTES de la aserción

    expect(component.registrationSuccess).toBeTrue();
    expect(component.registrationError).toBeFalse();
    expect(component.registerForm.value).toEqual({ username: null, password: null, role: null });

  }));

  it('should handle error on form submission', waitForAsync(() => {
    component.registerForm.setValue({
      username: 'fallido',
      password: '123456',
      role: 'user'
    });

    component.onSubmit();

    const req = httpMock.expectOne('http://localhost:8080/api/users/register');
    expect(req.request.method).toBe('POST');
    req.flush('Error', { status: 400, statusText: 'Bad Request' });

    fixture.whenStable().then(() => {
      expect(component.registrationSuccess).toBeFalse();
      expect(component.registrationError).toBeTrue();
    });
  }));

  it('should not submit if form is invalid', () => {
    component.registerForm.setValue({
      username: '',
      password: '',
      role: ''
    });

    component.onSubmit();

    // No se debe realizar ninguna petición HTTP
    httpMock.expectNone('http://localhost:8080/api/users/register');
  });
});