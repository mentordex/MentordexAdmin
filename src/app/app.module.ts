import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';


import { adminLteConf } from './admin-lte.conf';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';

import { LayoutModule } from 'angular-admin-lte';

import { AppComponent } from './app.component';


import { LoadingPageModule, MaterialBarModule } from 'angular-loading-page';

//importing intercepters
import { ApiIntercepter } from './core/intercepters/api.intercepter';
import { TokenInterceptor } from './core/intercepters/token.interceptor';
import { HttpErrorInterceptor } from './core/intercepters/http-error.interceptor';

//importing services
import { UtilsService } from './core/services';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    LayoutModule.forRoot(adminLteConf),
    LoadingPageModule, MaterialBarModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
    
  ],
  declarations: [
    AppComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent
  ],
  providers: [ 
    UtilsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiIntercepter, multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor, multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor, multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
