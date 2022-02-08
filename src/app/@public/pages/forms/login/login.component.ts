import { Component } from '@angular/core';
import { ILoginForm, IResultLogin } from '@core/interfaces/login.interface';
import { AuthService } from '@core/services/auth.service';
// import { TYPE_ALERT } from '@shared/alerts/values.config';
import { TYPE_ALERT } from '../../../../@shared/alerts/values.config';
// import { basicAlert } from '@shared/alerts/toastr';
import { basicAlert } from '../../../../@shared/alerts/toastr';
import { IMeData } from '@core/interfaces/session.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  login: ILoginForm = {
    email: '',
    password: '',
  };

  constructor(private auth: AuthService, private router: Router) {}

  // ngOnInit(): void {
  //   this.auth.start();
  // }

  init() {
    console.log(this.login);
    this.auth
      .login(this.login.email, this.login.password)
      .subscribe((result: IResultLogin) => {
        console.log(result);

        if (result.status) {
          if (result.token !== null) {
            basicAlert(TYPE_ALERT.SUCCESS, result.message);
            this.auth.setSession(result.token);
            this.auth.updateSession(result);
            this.router.navigate(['/home']);
            return;
          }
          basicAlert(TYPE_ALERT.WARNING, result.message);
          return;
        }

        basicAlert(TYPE_ALERT.INFO, result.message);
      });
  }
}
