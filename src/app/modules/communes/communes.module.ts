import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommunesRoutingModule } from './communes-routing.module';
import { CommunesComponent } from './communes.component';
import { GetCommunesComponent } from './components/get-communes/get-communes.component';

@NgModule({
  declarations: [CommunesComponent, GetCommunesComponent],
  imports: [CommonModule, CommunesRoutingModule],
})
export class CommunesModule {}
