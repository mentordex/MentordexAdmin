import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


//import custom validators
import { CustomValidators } from '../../core/custom-validators';

//services
import { fadeInAnimation } from '../../core/animations';
import { AuthService, TitleService, UtilsService } from '../../core/services'
import { environment } from '../../../environments/environment'
import Swal from 'sweetalert2'


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>();
  changePasswordForm: FormGroup;
  isFormSubmitted:boolean = false;
  token:any=''

  constructor(private activatedRoute:ActivatedRoute, private utilsService:UtilsService, private authService:AuthService, private formBuilder: FormBuilder, private router: Router, private titleService: TitleService) {
  }

  ngOnInit() {
    this.titleService.setTitle();
    this.initChangePasswordForm();
  }

   //forgot password form
   private initChangePasswordForm(){
    this.changePasswordForm = this.formBuilder.group({
      old_password: [null, [Validators.required]],
      password: [null, [Validators.required,Validators.minLength(10),Validators.maxLength(50)]],
      repassword: [null, [Validators.required, Validators.minLength(10),Validators.maxLength(50)]],
      user_id:[localStorage.getItem('loggedinUserId')]
    },{
      // check whether our password and confirm password match
      validators: CustomValidators.passwordMatchValidator
    }
  );

}



  //onsubmit login form
  onSubmit() {
    if (this.changePasswordForm.invalid) {
      //console.log(this.changePasswordForm);
      this.isFormSubmitted= true
      return false;      
    }    
   

    this.utilsService.showPageLoader(environment.MESSAGES['SAVING-INFO']);//show page loader
    this.utilsService.processPostRequest('/admin/changePassword',this.changePasswordForm.value).pipe(takeUntil(this.destroy$)).subscribe((response) => {

      this.utilsService.onSuccess(environment.MESSAGES['SUCCESSFULLY-SAVED']);
      this.router.navigate(['/login']);
    })
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

}
