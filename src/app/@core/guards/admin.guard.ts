import { Injectable } from '@angular/core';
import {
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '@core/services/auth.service';
const jwtDecode = require('jwt-decode');

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivateChild {
  constructor(private auth: AuthService, private router: Router) {}
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Primero comprobar que existe session
    if (this.auth.getSession() !== null) {
      console.log('estamos loguedos');
      const dataDecode = this.decodeToken();
      console.log(dataDecode);
      //comprobar que no esta caducada el token
      if (dataDecode.exp < new Date().getTime() / 1000) {
        console.log('secion  caducada');
        // return this.redirect();
      }

      // el role de usuario es ADMIN
      if (dataDecode.user.role === 'ADMIN') {
        console.log('somos adminstradores');
        return true;
      }
      console.log('no somos adminstradores');
    }
    console.log('sesion no iniciada');
    return this.redirect();
  }
  redirect() {
    this.router.navigate(['/login']);
    return false;
  }
  decodeToken() {
    return jwtDecode(this.auth.getSession().token);
  }
}

// tiene que tener la version jwt@2.2.0
//   return jwtDecode(this.auth.getSession().token);
