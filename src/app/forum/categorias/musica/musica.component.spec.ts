import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MusicaComponent } from './musica.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';

describe('MusicaComponent', () => {
  let component: MusicaComponent;
  let fixture: ComponentFixture<MusicaComponent>;

  // Mock del servicio UserService
  const userServiceMock = {
    isAdmin: () => true,
    getUsername: () => 'usuarioTest'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MusicaComponent,
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: UserService, useValue: userServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MusicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
