import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from "@angular/router";
import { ToastrManager } from 'ng6-toastr-notifications';//toaster class

//import services
import { AuthService, UtilsService } from '../../services'
import { environment } from '../../../../environments/environment'
@Component({
  selector: 'app-header-inner',
  templateUrl: './header-inner.component.html'
})
export class HeaderInnerComponent implements OnInit{
  
  adminData:any = {}
  constructor(private router: Router, private authService:AuthService, private toastrManager:ToastrManager, private utilsService:UtilsService, private ngZone:NgZone){
    
  }
  logout(){
   
    this.toastrManager.successToastr(environment.MESSAGES['SUCCESSFULLY-LOGOUT'], 'Success!');//showing success toaster
    localStorage.removeItem('loggedinUser');
    localStorage.clear();
    this.authService.isLoggedIn(false, '');
    this.router.navigate(['/login']);   
  }

  ngOnInit() {
    

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
       // console.log('response',response);
         this.ngZone.run(() => {
           this.adminData = response 
         });
          
         
       });
     }
  }
}
