import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CoreModule } from '../core/core.module';
import { HomeRoutingModule } from './home-routing.module';
import { AdminsComponent } from './admins/admins.component';
import { UsersComponent } from './users/users.component';
import { CategoryComponent } from './category/category.component';
import { AmenityComponent } from './amenity/amenity.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { OfficesComponent } from './offices/offices.component';
import { TeamsComponent } from './teams/teams.component';
import { SubcategoryComponent } from './subcategory/subcategory.component';
import { FaqCategoryComponent } from './faq-category/faq-category.component';
import { CountryComponent } from './location/country/country.component';
import { StateComponent } from './location/state/state.component';
import { CityComponent } from './location/city/city.component';
import { ImageUploadDropzoneComponent } from './image-upload-dropzone/image-upload-dropzone.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { SlotsComponent } from './slots/slots.component';
import { BannerComponent } from './banner/banner.component';
import { JobsListingComponent } from './jobs-listing/jobs-listing.component';
import { MembershipComponent } from './membership/membership.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';


@NgModule({
  declarations: [AdminsComponent, UsersComponent, CategoryComponent, AmenityComponent, DashboardComponent, ProfileComponent, ChangePasswordComponent, OfficesComponent, TeamsComponent, SubcategoryComponent, FaqCategoryComponent, CountryComponent, StateComponent, CityComponent, ImageUploadDropzoneComponent, AppointmentComponent, SlotsComponent, BannerComponent, JobsListingComponent, MembershipComponent, TestimonialsComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class HomeModule { }
