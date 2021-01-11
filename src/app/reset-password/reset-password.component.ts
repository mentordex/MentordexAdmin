import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


//import custom validators
import { CustomValidators } from '../core/custom-validators';

//services
import { fadeInAnimation } from '../core/animations';
import { AuthService, TitleService, UtilsService } from '../core/services'
import { environment } from '../../environments/environment'
import Swal from 'sweetalert2'


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>();
  resetPasswordForm: FormGroup;
  isFormSubmitted:boolean = false;
  token:any=''

  constructor(private activatedRoute:ActivatedRoute, private utilsService:UtilsService, private authService:AuthService, private formBuilder: FormBuilder, private router: Router, private titleService: TitleService) {
    //this.utilsService.checkAndRedirect();

    //checking & authorizing the token
    this.activatedRoute.params.subscribe((params) => {
      this.token = params['token'];

      this.utilsService.showPageLoader(environment.MESSAGES['CHECKING-AUTHORIZATION']);//show page loader
      this.authService.verifyToken({token:this.token}).pipe(takeUntil(this.destroy$)).subscribe((response) => {
        this.resetPasswordForm.patchValue({
          token:this.token
        })       
        
      })      
     })
  }

  ngOnInit() {
    this.titleService.setTitle();
    this.initForgotPasswordForm();
  }

   //forgot password form
   private initForgotPasswordForm(){
    this.resetPasswordForm = this.formBuilder.group({
      password: [null, [Validators.required,Validators.minLength(10),Validators.maxLength(50)]],
      repassword: [null, [Validators.required, Validators.minLength(10),Validators.maxLength(50)]],
      token:[]
    },{
      // check whether our password and confirm password match
      validators: CustomValidators.passwordMatchValidator
    }
  );

}



  //onsubmit login form
  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      //console.log(this.resetPasswordForm);
      this.isFormSubmitted= true
      return false;      
    }
    
    if((this.resetPasswordForm.get('token').value==null) || (this.resetPasswordForm.get('token').value).length<=0){
      Swal.fire({
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        },
        icon: 'error',
        title: 'Error!!',
        text: 'System can not process your request due to token mismatch. Please try with valid link.'
      })
      return false;     
    }

    this.utilsService.showPageLoader(environment.MESSAGES['SAVING-INFO']);//show page loader
    this.utilsService.processPostRequest('/admin/updatePassword',this.resetPasswordForm.value).pipe(takeUntil(this.destroy$)).subscribe((response) => {

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
