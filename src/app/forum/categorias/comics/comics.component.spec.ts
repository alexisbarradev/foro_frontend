import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComicsComponent } from './comics.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';

// Mock de UserService
class MockUserService {
  isAdmin() {
    return true;
  }

  getUsername() {
    return 'MockedUser';
  }
}

describe('ComicsComponent', () => {
  let component: ComicsComponent;
  let fixture: ComponentFixture<ComicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ComicsComponent,
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: UserService, useClass: MockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ComicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
