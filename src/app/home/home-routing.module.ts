import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminsComponent } from './admins/admins.component';
import { UsersComponent } from './users/users.component';
import { CategoryComponent } from './category/category.component';
import { AmenityComponent } from './amenity/amenity.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProfileComponent } from './profile/profile.component';
import { OfficesComponent } from './offices/offices.component';
import { TeamsComponent } from './teams/teams.component';
import { SubcategoryComponent } from './subcategory/subcategory.component';
import { FaqCategoryComponent } from './faq-category/faq-category.component';
import { CountryComponent } from './location/country/country.component';
import { StateComponent } from './location/state/state.component';
import { CityComponent } from './location/city/city.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { SlotsComponent } from './slots/slots.component';
import { BannerComponent } from './banner/banner.component';
import { JobsListingComponent } from './jobs-listing/jobs-listing.component';
import { MembershipComponent } from './membership/membership.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';

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
    path: 'city/:stateID/:countryID',
    component: CityComponent,   
    data: { title: 'City List' }
  },
  {
    path: 'appointment',
    component: AppointmentComponent,   
    data: { title: 'Appointment List' }
  },
  {
    path: 'slots',
    component:   SlotsComponent ,   
    data: { title: 'Slots List' }
  },
  {
    path: 'banners',
    component:   BannerComponent ,   
    data: { title: 'Banners List' }
  },
  {
    path: 'jobs',
    component:   JobsListingComponent ,   
    data: { title: 'Jobs Listing' }
  },
  {
    path: 'Memberships',
    component:   MembershipComponent ,   
    data: { title: 'Membership Listing' }
  },
  {
    path: 'reviews',
    component:   TestimonialsComponent ,   
    data: { title: 'Testimonials & Reviews' }
  }
  

   
  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
