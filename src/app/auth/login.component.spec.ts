import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthFacade } from '../auth/auth.facade'; // Ajusta el path según tu estructura
import { of } from 'rxjs';

// ✅ Mock de AuthFacade (evita peticiones reales)
const authFacadeMock = {
  login: jasmine.createSpy('login').and.returnValue(of(true)),
  isAuthenticated$: of(false)
};

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientTestingModule], // ✅ Incluye HttpClientTestingModule
      providers: [
        { provide: AuthFacade, useValue: authFacadeMock }  // ✅ Inyecta el mock del servicio
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
