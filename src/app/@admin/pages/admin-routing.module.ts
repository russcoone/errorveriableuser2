import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';


const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        
          path: '',
          loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
        },
        {
          path: 'user',
          loadChildren: () => import('./user/user.module').then(m => m.UserModule)
        },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
