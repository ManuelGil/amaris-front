import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CommunesComponent } from './communes.component';
import { GetCommunesComponent } from './components/get-communes/get-communes.component';

const routes: Routes = [
  {
    path: '',
    component: CommunesComponent,
    children: [
      {
        path: 'get',
        component: GetCommunesComponent,
        data: {
          title: 'Lista de comunas',
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
export class CommunesRoutingModule {}
