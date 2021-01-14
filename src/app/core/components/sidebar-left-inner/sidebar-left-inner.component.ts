import { Component, NgZone, OnInit } from '@angular/core';

//import services
import { AuthService, UtilsService } from '../../services'
import { environment } from '../../../../environments/environment'

@Component({
  selector: 'app-sidebar-left-inner',
  templateUrl: './sidebar-left-inner.component.html'
})
export class SidebarLeftInnerComponent {
  adminData:any = {}
  constructor(private authService:AuthService, private utilsService:UtilsService, private ngZone:NgZone){
    this.authService.checkLoggedinStatus().subscribe((loginStatus) => {   

      if(loginStatus.isLoggedIn){
        this.utilsService.processPostRequest('/admin/adminData',{userID:localStorage.getItem('loggedinUserId')}).subscribe((response) => {
         //console.log('response',response);
          this.ngZone.run(() => {
            this.adminData = response 
          });
           
          
        });
      }
     });

     if (localStorage.getItem('loggedinUserId')) {
      this.utilsService.processPostRequest('/admin/adminData',{userID:localStorage.getItem('loggedinUserId')}).subscribe((response) => {
        //console.log('response',response);
         this.ngZone.run(() => {
           this.adminData = response 
         });
          
         
       });
     }
  }
}
