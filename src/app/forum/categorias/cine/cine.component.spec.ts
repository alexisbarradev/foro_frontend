import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CineComponent } from './cine.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';

// Mock mínimo de UserService
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CineComponent, HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        { provide: UserService, useClass: MockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
