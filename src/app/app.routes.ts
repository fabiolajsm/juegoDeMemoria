import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full',
  },
  {
    path: 'splash',
    loadComponent: () =>
      import('./splash/splash.page').then((m) => m.SplashPage),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'juego',
    loadComponent: () => import('./game/game.page').then((m) => m.GamePage),
  },
  {
    path: 'mejoresRegistros',
    loadComponent: () =>
      import('./best-score/best-score.page').then((m) => m.BestScorePage),
  },
];
