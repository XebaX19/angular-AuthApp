import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';

import { environment } from 'src/environments/environments';
import { AuthStatus, CheckTokenResponse, LoginResponse, User } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  private _currentUser = signal<User|null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking); //Reacciona cuando hay un cambio de estado en _authStatus (conozco si la persona esta o no autenticada)

  public currentUser = computed(() => this._currentUser()); //Expongo hacia afuera una copia del _currentUser, para que nadie desde afuera pueda cambiar esta propiedad
  public authStatus = computed(() => this._authStatus()); //Expongo hacia afuera una copia del _authStatus, para que nadie desde afuera pueda cambiar esta propiedad

  constructor() {
    this.checkAuthStatus().subscribe();
  }

  private setAuthentication(user: User, token: string): boolean {
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);

    return true;
  }

  login(email: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password };

    return this.http.post<LoginResponse>(url, body)
      .pipe(
        //Mapeo la respuesta que daré si es un user/pass válido
        map(({ user, token }) => this.setAuthentication(user, token)), //El metodo setAuthentication devuelve "true"

        //En caso de user/pass inválido
        catchError(err => {
          //Lanzo error de rxjs
          return throwError(() => err.error.message);
        })
      );
  }

  register(email: string, password: string, name: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/register`;
    const body = { email, password, name };

    return this.http.post<LoginResponse>(url, body)
      .pipe(
        //Mapeo la respuesta que daré si es un user/pass válido
        map(({ user, token }) => this.setAuthentication(user, token)), //El metodo setAuthentication devuelve "true"

        //En caso de user/pass inválido
        catchError(err => {
          //Lanzo error de rxjs
          return throwError(() => err.error.message);
        })
      );
  }

  checkAuthStatus(): Observable<boolean> {
    const url = `${ this.baseUrl }/auth/check-token`;
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();

      return of(false); //Devuelve un Observable del valor que se pasa entre parentesis
    }

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${ token }`);

    return this.http.get<CheckTokenResponse>(url, { headers })
      .pipe(
        map(({ user, token }) => this.setAuthentication(user, token)), //El metodo setAuthentication devuelve "true"

        //Si da algun error quiere decir que no está autenticado
        catchError(() => {
          this._authStatus.set(AuthStatus.notAuthenticated);

          return of(false)
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
  }
}
