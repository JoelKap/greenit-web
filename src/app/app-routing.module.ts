import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificationComponent } from './notification/notification.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ViewRepairsComponent } from './view-repairs/view-repairs.component';
import { ViewRecyclesComponent } from './view-recycles/view-recycles.component';
import { ViewDevicesComponent } from './view-devices/view-devices.component';
import { RepairDashboardComponent } from './repair-dashboard/repair-dashboard.component';
import { WarrantyComponent } from './warranty/warranty.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'view-devices',
    component: ViewDevicesComponent,
  },
  {
    path: 'view-recycles',
    component: ViewRecyclesComponent,
  },
  {
    path: 'view-repairs',
    component: ViewRepairsComponent,
  },
  {
    path: 'view-notifications',
    component: NotificationComponent,
  },
  {
    path: 'view-warantees',
    component: WarrantyComponent,
  },
  {
    path: 'repair-dashboard',
    component: RepairDashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
