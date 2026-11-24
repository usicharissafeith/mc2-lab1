import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'notes',
    loadComponent: () => import('./notes/notes.page').then((m) => m.NotesPage),
  },
  {
    path: 'appointments',
    loadComponent: () => import('./appointments/appointments.page').then((m) => m.AppointmentsPage),
  },
];
