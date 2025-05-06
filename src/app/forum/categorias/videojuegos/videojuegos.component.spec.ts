import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VideojuegosComponent } from './videojuegos.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';

// Mock para UserService
const mockUserService = {
  isAdmin: () => true,
  getUsername: () => 'usuarioTest'
};

describe('VideojuegosComponent', () => {
  let component: VideojuegosComponent;
  let fixture: ComponentFixture<VideojuegosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        VideojuegosComponent,
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: UserService, useValue: mockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VideojuegosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
