import { Injectable } from '@angular/core';
import { IRegisterForm } from '@core/interfaces/rigister.interface';
import { UsersService } from '@core/services/users.service';
import {
  ACTIVE_EMAIL_USER,
  BLOCK_USER,
  UPDATE_USER,
} from '@graphql/operations/mutation/user';
import { ApiService } from '@graphql/services/api.service';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root',
})
export class UserAdminService extends ApiService {
  constructor(private usersService: UsersService, apollo: Apollo) {
    super(apollo);
  }

  register(user: IRegisterForm) {
    return this.usersService.register(user);
  }

  update(user: IRegisterForm) {
    return this.set(UPDATE_USER, { user, include: false }).pipe(
      map((result: any) => {
        return result.updateUser;
      })
    );
  }

  unblock(id: string, unblock: Boolean = false, admin: Boolean = false) {
    return this.set(BLOCK_USER, { id, unblock, admin }).pipe(
      map((result: any) => {
        return result.blockUser;
      })
    );
  }
  sendEmailActive(id: string, email: string) {
    return this.set(ACTIVE_EMAIL_USER, { id, email }).pipe(
      map((result: any) => {
        return result.activeUserEmail;
      })
    );
  }
}
