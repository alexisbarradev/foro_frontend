import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  {
    path: 'forum',
    loadComponent: () => import('./forum/forum.component').then(m => m.ForumComponent),
    children: [
      { path: '', redirectTo: 'categorias', pathMatch: 'full' },
      {
        path: 'categorias',
        loadComponent: () =>
          import('./forum/categorias/categorias-component.component').then(m => m.CategoriasComponent)
      },
      {
        path: 'comics',
        loadComponent: () =>
          import('./forum/categorias/comics/comics.component').then(m => m.ComicsComponent)
      },
      {
        path: 'cine',
        loadComponent: () =>
          import('./forum/categorias/cine/cine.component').then(m => m.CineComponent)
      },
      {
        path: 'videojuegos',
        loadComponent: () =>
          import('./forum/categorias/videojuegos/videojuegos.component').then(m => m.VideojuegosComponent)
      },
      {
        path: 'musica',
        loadComponent: () =>
          import('./forum/categorias/musica/musica.component').then(m => m.MusicaComponent)
      },
      {
        path: 'libros',
        loadComponent: () =>
          import('./forum/categorias/libros/libros.component').then(m => m.LibrosComponent)
      },
      {
        path: 'usuarios', // ✅ Esta ruta es ahora hija de forum
        loadComponent: () =>
          import('./users/user-list/user-list.component').then(m => m.UserListComponent)
      },{
        path: 'usuarios/crear',
        loadComponent: () =>
          import('./users/user-register/user-register.component').then(m => m.UserRegisterComponent)

      }
      
    ]
  }

  // ❌ Eliminado: { path: 'users', component: UserListComponent }
];
