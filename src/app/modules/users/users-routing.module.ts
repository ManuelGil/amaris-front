import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersComponent } from './users.component';
import { GetUsersComponent } from './components/get-users/get-users.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { UpdateUserComponent } from './components/update-user/update-user.component';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    children: [
      {
        path: 'get',
        component: GetUsersComponent,
        data: {
          title: 'Lista de usuarios',
        },
      },
      {
        path: 'create',
        component: CreateUserComponent,
        data: {
          title: 'Crear un usuarios',
        },
      },
      {
        path: 'update/:id',
        component: UpdateUserComponent,
        data: {
          title: 'Editar un usuarios',
        },
      },
      { path: '', redirectTo: 'get', pathMatch: 'full' },
      { path: '**', redirectTo: 'get', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
