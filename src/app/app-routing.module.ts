import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ViewFoundDocumentsComponent } from './view-found-documents/view-found-documents.component';
import { ViewLostDocumentsComponent } from './view-lost-documents/view-lost-documents.component';

const routes: Routes = [{
  path: 'home', component: HomeComponent
},
{
  path: '',
  redirectTo: '/home',
  pathMatch: 'full'
},
{
  path: 'login',
  component: LoginComponent
},
{
  path: 'dashboard',
  component: DashboardComponent
},
{
  path: 'view-lostDocuments',
  component: ViewLostDocumentsComponent
},
{
  path: 'view-foundDocuments',
  component: ViewFoundDocumentsComponent
},
// {
//   path: 'dashboard',
//   component: DashboardComponent
// },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
