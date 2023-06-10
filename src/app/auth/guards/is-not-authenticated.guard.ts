import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../interfaces';

export const isNotAuthenticatedGuard: CanActivateFn = (route, state) => {
  //Para conocer y guardar en localStorage la ruta a la que se está intentando acceder...lo necesitaria para obtenerla en el "app.component.ts"
  // const url = state.url;
  // localStorage.setItem('url', url);

  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.authStatus() === AuthStatus.authenticated) {
    router.navigateByUrl('/dashboard');
    return false;
  }

  return true;
};
