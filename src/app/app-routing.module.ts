import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'Get Started'
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./+login/login.module').then(m => m.LoginModule),
        data: {
          customLayout: true
        }
      },
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
        data: {
          customLayout: false
        }
      },    
    ]
  }, 
  {
    path: 'login',
    loadChildren: () => import('./+login/login.module').then(m => m.LoginModule),
    data: {
      customLayout: true
    }
  },
  {
    path: 'forgot-password',
    component:ForgotPasswordComponent,   
    data: {
      customLayout: true,
      title:"Forgot Password",
    }
  },
  {
    path: 'reset-password/:token',
    component:ResetPasswordComponent,   
    data: {
      customLayout: true,
      title:"Reset Password",
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
