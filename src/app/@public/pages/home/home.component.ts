import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { UsersService } from '@core/services/users.service';
import { ApiService } from '@graphql/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private userApi: UsersService, private auth: AuthService) {}

  ngOnInit(): void {
    //   this.userApi.getUsers().subscribe((result) => {
    //     console.log(result); //{user, starus,message}
    //   });
    //   this.auth.getMe().subscribe((result) => {
    //     console.log(result); //{starus,message}
    //   });
    // }
  }
}
