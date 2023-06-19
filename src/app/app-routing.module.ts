import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { isAuthenticatedGuard, isNotAuthenticatedGuard } from './auth/guards';

const routes: Routes = [
  {
    path: 'auth',
    canActivate: [ isNotAuthenticatedGuard ],
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    canActivate: [ isAuthenticatedGuard ], //El guard valida que esté autenticado para ingresar al dashboard. Además se pueden agregar guards en cada ruta hija del dashboard 
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];

@NgModule({
  //El "useHash" es utilizado para que todas las rutas inicien desde el index en la raiz del proyecto
  //(sin esto, es posible que no funcione la app cuando recargo el navegador en alguna ruta en particular, al desplegar el proyecto en Producción
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
