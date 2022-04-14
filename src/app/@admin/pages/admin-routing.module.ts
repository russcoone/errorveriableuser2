import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from '@core/guards/admin.guard';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./user/user.module').then((m) => m.UserModule),
      },
      {
        path: 'genres',
        loadChildren: () =>
          import('./genres/genres.module').then((m) => m.GenresModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
