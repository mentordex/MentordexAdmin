import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CoreModule } from '../../core/core.module';
import { CmsRoutingModule } from './cms-routing.module';
import { AboutUsComponent } from './about-us/about-us.component';


@NgModule({
  declarations: [AboutUsComponent],
  imports: [
    CommonModule,
    CmsRoutingModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule

  ]
})
export class CmsModule { }
