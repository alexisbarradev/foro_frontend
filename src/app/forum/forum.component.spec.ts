import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ForumComponent } from './forum.component';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router'; // 👈 Importar ActivatedRoute
import { of } from 'rxjs';

describe('ForumComponent', () => {
  let component: ForumComponent;
  let fixture: ComponentFixture<ForumComponent>;

  const mockUserService = {
    getUsername: () => 'testUser',
    getRole: () => 'admin',
    isAdmin: () => true
  };

  const mockActivatedRoute = {
    params: of({}) // o usa lo que realmente necesites simular
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ForumComponent
      ],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute } // 👈 agregar ActivatedRoute
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ForumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a username and role from the service', () => {
    expect(component.username).toBe('testUser');
    expect(component.role).toBe('admin');
  });

  it('should return true from isAdmin()', () => {
    expect(component.isAdmin()).toBeTrue();
  });
});
