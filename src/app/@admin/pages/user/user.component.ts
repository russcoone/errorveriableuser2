import { Component, OnInit } from '@angular/core';
import { ACTIVE_FILTERS } from '@core/constants/filters';
import { IResultData } from '@core/interfaces/result-data.interface';
import { IRegisterForm } from '@core/interfaces/rigister.interface';
import { ITableColumns } from '@core/interfaces/table-columns.interface';
import { USERS_LIST_QUERY } from '@graphql/operations/query/user';
import { opcionWithDetails, userFormBasicDialog } from '@shared/alerts/alerts';
import { basicAlert } from '@shared/alerts/toastr';
import { TYPE_ALERT } from '@shared/alerts/values.config';
import { DocumentNode } from 'graphql';
import { UserAdminService } from './user-admin.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  query: DocumentNode = USERS_LIST_QUERY;
  context: object;
  itemsPage: number;
  resultData: IResultData;
  include: boolean;
  columns: Array<ITableColumns>;
  filterActiveValues: ACTIVE_FILTERS = ACTIVE_FILTERS.ACTIVE;

  constructor(private service: UserAdminService) {}

  ngOnInit(): void {
    this.context = {};
    this.itemsPage = 10;
    this.resultData = {
      listkey: 'users',
      definitionkey: 'users',
    };
    this.include = true;
    this.columns = [
      {
        property: 'id',
        label: '#',
      },
      {
        property: 'name',
        label: 'Nombre',
      },
      {
        property: 'lastname',
        label: 'Apellidos',
      },
      {
        property: 'email',
        label: 'Correo electronico',
      },
      {
        property: 'role',
        label: 'Permisos',
      },
      {
        property: 'active',
        label: '¿Activo?',
      },
    ];
  }

  private initilizeForm(user: any) {
    const defaultName =
      user.name !== undefined && user.name !== '' ? user.name : '';
    const defaulLasname =
      user.lastname !== undefined && user.lastname !== '' ? user.lastname : '';
    const defaulEmail =
      user.email !== undefined && user.email !== '' ? user.email : '';

    const roles = new Array(2);
    roles[0] =
      user.role !== undefined && user.role === 'ADMIN' ? 'selected' : '';
    roles[1] =
      user.role !== undefined && user.role === 'CLIENT' ? 'selected' : '';

    return `
    <input id="name" value="${defaultName}" class="swal2-input" placeholder="Nombre" required>
    <input id="lastname" value="${defaulLasname}" class="swal2-input" placeholder="Apellidos" required>
    <input id="email" value="${defaulEmail}" class="swal2-input" placeholder="Correo Electronico" required>
    <select id="role" class="swal2-input">
        <option value="ADMIN" ${roles[0]}>Administrador</option>
        <option value="CLIENT" ${roles[1]}>Cliente</option>
    </select>
    `;
  }
  async takeAction($event) {
    // Coger la informacion para la acciones
    const action = $event[0];
    const user = $event[1];
    // Coger el valor por defecto
    // const defaultValue =
    // genre.name !== undefined && genre.name !== '' ? genre.name : '';
    // const html = `<input id="name" value="${defaultValue}" class="swal2-input" required>`;
    // Teniendo en cuenta el caso ejecutar una accion
    const html = this.initilizeForm(user);
    switch (action) {
      case 'add':
        // Añadir el item
        this.addForm(html);
        break;
      case 'edit':
        this.updateForm(html, user);
        break;
      case 'info':
        const result = await opcionWithDetails(
          'Detalles',
          `${user.name} ${user.lastname}<br>
          <i class="fas fa-envelope"></i>&nbsp;&nbsp${user.email}
          `,
          user.active !== false ? 375 : 400,
          ' <i class="fas fa-edit"></i> Editar', // true
          user.active !== false
            ? ' <i class="fas fa-lock"></i> Bloquear' // false
            : ' <i class="fa fa-unlock-alt" aria-hidden="true"></i> Desbloquear'
        );
        if (result) {
          this.updateForm(html, user);
        } else if (result === false) {
          this.unblockForm(user, false);
        }
        break;
      case 'block':
        this.unblockForm(user, false);
        break;
      case 'unblock':
        this.unblockForm(user, true);
        break;

      default:
        break;
    }
  }

  private async addForm(html: string) {
    const result = await userFormBasicDialog('Añadir usuario', html);
    console.log(result);
    this.addUser(result);
  }

  private addUser(result) {
    if (result.value) {
      const user: IRegisterForm = result.value;
      user.password = '1234';
      user.active = false;
      this.service.register(user).subscribe((res: any) => {
        console.log(res);
        if (res.status) {
          basicAlert(TYPE_ALERT.SUCCESS, res.message);
          this.service
            .sendEmailActive(res.user.id, user.email)
            .subscribe((resEmail) => {
              resEmail.status
                ? basicAlert(TYPE_ALERT.SUCCESS, resEmail.message)
                : basicAlert(TYPE_ALERT.WARNING, res.message);
            });
          return;
        }
        basicAlert(TYPE_ALERT.WARNING, res.message);
      });
    }
  }

  // private addUser(result) {
  //   if (result.value) {
  //     this.service.update(result.value).subscribe((res: any) => {
  //       console.log(res);
  //       if (res.status) {
  //         basicAlert(TYPE_ALERT.SUCCESS, res.message);
  //         return;
  //       }
  //       basicAlert(TYPE_ALERT.WARNING, res.message);
  //     });
  //   }
  // }

  private async updateForm(html: string, user: any) {
    const result = await userFormBasicDialog('Modificar  usuario', html);
    console.log(result);
    this.updateUser(result, user.id);
  }

  private updateUser(result, id: string) {
    if (result.value) {
      const user = result.value;
      user.id = id;
      console.log(user);
      this.service.update(result.value).subscribe((res: any) => {
        console.log(res);
        if (res.status) {
          basicAlert(TYPE_ALERT.SUCCESS, res.message);
          return;
        }
        basicAlert(TYPE_ALERT.WARNING, res.message);
      });
    }
  }
  private async unblockForm(user: any, unblock: boolean) {
    const result = unblock
      ? await opcionWithDetails(
          '¿Desbloquear?',
          'Si desbloqueas el Usuario seleccionado se mostrara en la lista y podras hacer compras y ver toda la informacion',
          500,

          ' No, no Desbloquear',
          ' Si, Desbloquear '
        )
      : await opcionWithDetails(
          '¿Bloquear?',
          'Si bloqueas el Usuario seleccionado no se mostrara en la lista',
          430,

          ' No, no bloquear',
          ' Si, Bloquear  '
        );
    if (result === false) {
      // resulado falso, queremos bloquear /desbloquear
      this.unblockUser(user.id, unblock, true);
    }
  }
  private unblockUser(
    id: string,
    unblock: boolean = false,
    admin: boolean = false
  ) {
    this.service.unblock(id, unblock, admin).subscribe((res: any) => {
      console.log(res);
      if (res.status) {
        basicAlert(TYPE_ALERT.SUCCESS, res.message);
        return;
      }
      basicAlert(TYPE_ALERT.WARNING, res.message);
    });
  }
}
