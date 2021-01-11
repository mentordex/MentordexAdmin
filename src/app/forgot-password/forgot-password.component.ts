import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

//services
import { AuthService, TitleService, UtilsService } from '../core/services'
import { environment } from '../../environments/environment'

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>();
  forgotPasswordForm: FormGroup;
  isFormSubmitted:boolean = false;
  constructor(private utilsService:UtilsService, private authService:AuthService, private formBuilder: FormBuilder, private router: Router, private titleService: TitleService) {
    this.utilsService.checkAndRedirect();
  }

  ngOnInit() {
    this.titleService.setTitle();
    this.initForgotPasswordForm();
  }

   //forgot password form
   private initForgotPasswordForm(){
    this.forgotPasswordForm = this.formBuilder.group({
      email: [null, [Validators.email, Validators.required]]     
    }
  );

}



  onSubmit() {      
    
    if (this.forgotPasswordForm.invalid) {     
      this.isFormSubmitted= true
      return false;      
    }
    this.utilsService.showPageLoader(environment.MESSAGES['SAVING-INFO']);//show page loader
    this.utilsService.processPostRequest('/admin/forgot-password',this.forgotPasswordForm.value).pipe(takeUntil(this.destroy$)).subscribe((response) => {
      this.utilsService.onSuccess(environment.MESSAGES['EMAIL-SENT']);    
      this.forgotPasswordForm.reset();  
    })
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
}