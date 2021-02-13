import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminsComponent } from './admins/admins.component';
import { UsersComponent } from './users/users.component';
import { CategoryComponent } from './category/category.component';
import { NeighbourhoodComponent } from './neighbourhood/neighbourhood.component';
import { PropertyTypeComponent } from './property-type/property-type.component';
import { PropertyComponent } from './property/property.component';
import { AmenityComponent } from './amenity/amenity.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProfileComponent } from './profile/profile.component';
import { ViewPropertyComponent } from './view-property/view-property.component';
import { OfficesComponent } from './offices/offices.component';
import { TeamsComponent } from './teams/teams.component';
import { SubcategoryComponent } from './subcategory/subcategory.component';
import { FaqCategoryComponent } from './faq-category/faq-category.component';
import { CountryComponent } from './location/country/country.component';
import { StateComponent } from './location/state/state.component';
import { CityComponent } from './location/city/city.component';
import { AppointmentComponent } from './appointment/appointment.component';

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
    path: 'category',
    component: CategoryComponent,   
    data: { title: 'Categories Listing' }
  },
  {
    path: 'subcategory',
    component: SubcategoryComponent,   
    data: { title: 'Subcategory Listing' }
  },
  {
    path: 'subcategory/:categoryID',
    component: SubcategoryComponent,   
    data: { title: 'Subcategory Listing' }
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
    path: 'faq-category',
    component: FaqCategoryComponent,   
    data: { title: 'FAQ Category' }
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
  {
    path: 'team',
    component: TeamsComponent,   
    data: { title: 'Our Team' }
  },
  {
    path: 'country',
    component: CountryComponent,   
    data: { title: 'Country List' }
  },
  {
    path: 'state',
    component: StateComponent,   
    data: { title: 'State List' }
  },
  {
    path: 'state/:countryID',
    component: StateComponent,   
    data: { title: 'State List' }
  },
  {
    path: 'city',
    component: CityComponent,   
    data: { title: 'City List' }
  },
  {
    path: 'city/:stateID',
    component: CityComponent,   
    data: { title: 'City List' }
  },
  {
    path: 'appointment',
    component: AppointmentComponent,   
    data: { title: 'Appointment List' }
  },
  

  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
