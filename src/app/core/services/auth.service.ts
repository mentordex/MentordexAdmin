import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Router, ActivatedRoute } from "@angular/router";
import 'rxjs/add/operator/map'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public loggedIn: Subject<any> = new Subject<any>();
  public profileUpdatedStatus: Subject<any> = new Subject<any>();

  constructor(private httpClient: HttpClient, private router: Router) { }

  isLoggedIn(value: boolean, userType: String) {
    this.loggedIn.next({ isLoggedIn: value, userType: userType });
  }
  checkLoggedinStatus(): Observable<any> {
    return this.loggedIn.asObservable();
  }

  isProfileUpdated(value: boolean) {
    this.profileUpdatedStatus.next(value);
  }
  getUpdatedProfileStatus(): Observable<any> {
    return this.profileUpdatedStatus.asObservable();
  }

  /***************************************************************************
   * Admin Auth Funtions
   *******************************************************************/
    

  isSellerLoggedin(){
    if (JSON.parse(localStorage.getItem("loggedinUser"))) {
      // logged in so return true
      return true;
    }
    return false
  }

  login(postedData): Observable<any> {

    return this.httpClient
      .post('/admin/login', postedData, { observe: 'response' })
      .map((response: any) => {
        return response;
      })

  } 

  fetchAdminData(postedData): Observable<any> {

    return this.httpClient
      .post('/fetchData', postedData)
      .map((response: Response) => {
        return response;
      })

  }
  verifyToken(postedData): Observable<any> {      
    return this.httpClient
        .post('/admin/verifyToken', postedData)  
  } 

   
}