import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../interfaces';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  //Para conocer y guardar en localStorage la ruta a la que se está intentando acceder...lo necesitaria para obtenerla en el "app.component.ts"
  // const url = state.url;
  // localStorage.setItem('url', url);

  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.authStatus() === AuthStatus.authenticated) {
    return true;
  }

  //No hace falta...
  // if (authService.authStatus() === AuthStatus.checking) {
  //   //Si todavia no validé si está autenticado o no, retorno false sin hacer la redirección
  //   return false;
  // }

  router.navigateByUrl('/auth/login');

  return false;
};
