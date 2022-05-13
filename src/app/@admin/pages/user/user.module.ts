import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { TablePaginationModule } from '../../../@shared/table-pagination/table-pagination.module';

@NgModule({
  declarations: [UserComponent],
  imports: [CommonModule, UserRoutingModule, TablePaginationModule],
})
export class UserModule {}
