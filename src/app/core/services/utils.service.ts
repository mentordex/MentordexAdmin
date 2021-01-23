import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { ToastrManager } from 'ng6-toastr-notifications';//toaster class
import { Router } from "@angular/router";
//import shared services
import { PageLoaderService } from './page-loader.service'
import { AuthService } from './auth.service'

import { environment } from '../../../environments/environment'

import Swal from 'sweetalert2'

@Injectable({ providedIn: 'root' })
export class UtilsService { 

 
  constructor(private httpClient: HttpClient, private toastrManager:ToastrManager, private pageLoaderService: PageLoaderService, private authService:AuthService, private router:Router) { }

  
  /**
  * Show page loder on fetching data
  * @return void
  */
 public showPageLoader(message = ''):void{
  this.pageLoaderService.pageLoader(true);//show page loader
  if(message.length>0){      
    this.pageLoaderService.setLoaderText(message);//setting loader text
  }
  
}

/**
* Hide page loder on fetching data
* @return void
*/
public hidePageLoader(): void {
  this.pageLoaderService.pageLoader(false);//hide page loader
  this.pageLoaderService.setLoaderText('');//setting loader text
}

/**
* Show alert on success response & hide page loader
* @return void
*/
public onSuccess(message): void {
  this.pageLoaderService.pageLoader(false);//hide page loader
  this.pageLoaderService.setLoaderText('');//setting loader text empty
  this.toastrManager.successToastr(message, 'Success!'); //showing success toaster 
}

/**
* Show alert on error response & hide page loader
* @return void
*/
public onError(message): void {
  this.pageLoaderService.setLoaderText('');//setting loader text
  this.pageLoaderService.pageLoader(false);//hide page loader
  this.toastrManager.errorToastr(message, 'Oops!',{maxShown:1});//showing error toaster message  
}

/**
* Logout user from the system and erase all info from localstorage
* @return void
*/
public logout():void{
  this.toastrManager.successToastr('Loggedout Successfully', 'Success!');//showing 
  
  localStorage.clear();
  //this.authService.isLoggedIn(false);
  this.router.navigate(['/']);    
}

/**
* Check the user is loggedin oterwise redirect to login page
* @return void
*/

public checkAndRedirect(){
  if (localStorage.getItem("mentordex-superadmin-x-auth-token")) {
    this.router.navigate(['/home']);
  }
}

/**
* Post the data and endpoint 
*/
processPostRequest(apiEndPoint, data){
  return this.httpClient
      .post(apiEndPoint, data)
}
/**
* Get the data using posted endpoint 
*/
processGetRequest(apiEndPoint){
  return this.httpClient
      .get(apiEndPoint)
}

imageUploadRequest(apiEndPoint, data){
  console.log(data)

  const headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json'
  });
  return this.httpClient
      .post(apiEndPoint, data, {headers: headers})
}



}