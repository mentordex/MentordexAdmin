import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CoreModule } from '../core/core.module';
import { HomeRoutingModule } from './home-routing.module';
import { AdminsComponent } from './admins/admins.component';
import { UsersComponent } from './users/users.component';
import { CityComponent } from './city/city.component';
import { NeighbourhoodComponent } from './neighbourhood/neighbourhood.component';
import { PropertyTypeComponent } from './property-type/property-type.component';
import { PropertyComponent } from './property/property.component';
import { AmenityComponent } from './amenity/amenity.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ViewPropertyComponent } from './view-property/view-property.component';
import { OfficesComponent } from './offices/offices.component';


@NgModule({
  declarations: [AdminsComponent, UsersComponent, CityComponent, NeighbourhoodComponent, PropertyTypeComponent, PropertyComponent, AmenityComponent, DashboardComponent, ProfileComponent, ChangePasswordComponent, ViewPropertyComponent, OfficesComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class HomeModule { }
