import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminsComponent } from './admins/admins.component';
import { UsersComponent } from './users/users.component';
import { CityComponent } from './city/city.component';
import { NeighbourhoodComponent } from './neighbourhood/neighbourhood.component';
import { PropertyTypeComponent } from './property-type/property-type.component';
import { PropertyComponent } from './property/property.component';
import { AmenityComponent } from './amenity/amenity.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProfileComponent } from './profile/profile.component';
import { ViewPropertyComponent } from './view-property/view-property.component';
import { OfficesComponent } from './offices/offices.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,   
    data: { title: 'Admin Dashboard' }
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,   
    data: { title: 'Change Password' }
  },
  {
    path: 'admins',
    component: AdminsComponent,   
    data: { title: 'Admin Listing' }
  },
  {
    path: 'users',
    component: UsersComponent,   
    data: { title: 'Users Listing' }
  },  
  {
    path: 'city',
    component: CityComponent,   
    data: { title: 'Cities Listing' }
  }, 
  {
    path: 'neighbourhood',
    component: NeighbourhoodComponent,   
    data: { title: 'Neighbourhoods Listing' }
  },
  {
    path: 'neighbourhood/:cityID',
    component: NeighbourhoodComponent,   
    data: { title: 'Neighbourhoods Listing' }
  },
  {
    path: 'property-type',
    component: PropertyTypeComponent,   
    data: { title: 'Property Types Listing' }
  },
  {
    path: 'property/:userID/:status',
    component: PropertyComponent,   
    data: { title: 'Property Listing' }
  },
 
  {
    path: 'property',
    component: PropertyComponent,   
    data: { title: 'Property Listing' }
  },
  {
    path: 'faqs',
    component: AmenityComponent,   
    data: { title: 'FAQ Listing' }
  },
  {
    path: 'profile',
    component: ProfileComponent,   
    data: { title: 'Admin Profile' }
  },
  {
    path: 'property-view/:propertyID',
    component: ViewPropertyComponent,   
    data: { title: 'Property Details' }
  },
  {
    path: 'offices',
    component: OfficesComponent,   
    data: { title: 'Our Offices' }
  },
  

  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
