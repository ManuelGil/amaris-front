import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CreateUserComponent } from './components/create-user/create-user.component';
import { GetUsersComponent } from './components/get-users/get-users.component';
import { UpdateUserComponent } from './components/update-user/update-user.component';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';

@NgModule({
  declarations: [
    UsersComponent,
    CreateUserComponent,
    GetUsersComponent,
    UpdateUserComponent,
  ],
  imports: [CommonModule, UsersRoutingModule, FormsModule, ReactiveFormsModule],
})
export class UsersModule {}
