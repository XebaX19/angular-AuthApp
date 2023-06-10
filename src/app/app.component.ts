import { Component, computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/services/auth.service';
import { AuthStatus } from './auth/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  public finishedAuthCheck = computed<boolean>(() => {
    if (this.authService.authStatus() === AuthStatus.checking) {
      return false;
    }

    return true;
  });

  //Se dispara cada vez que alguna señal dentro del efecto cambie
  public authStatusChangedEffect = effect(() => {
    switch(this.authService.authStatus()) {
      case AuthStatus.checking: 
        return;
      
      case AuthStatus.authenticated:
        this.router.navigateByUrl('/dashboard'); //Podria obtener la ruta del localStoraga, guardandola en el "is-authenticated.guard.ts" (esta comentado)
        return;
      
      case AuthStatus.notAuthenticated:
        this.router.navigateByUrl('/auth/login');
        return;
    }
    
  });
}
