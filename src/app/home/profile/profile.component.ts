import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ImageCroppedEvent } from 'ngx-image-cropper';

//import custom validators
import { CustomValidators } from '../../core/custom-validators';

//services
import { fadeInAnimation } from '../../core/animations';
import { AuthService, TitleService, UtilsService } from '../../core/services'
import { environment } from '../../../environments/environment'
import Swal from 'sweetalert2'


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>();
  profileForm: FormGroup;
  isFormSubmitted:boolean = false;
  croppedImage:string='assets/img/avatar5.png';
  imageChangedEvent: any = '';
  adminData:any = {}
  showCropper:boolean = false;

  constructor(private activatedRoute:ActivatedRoute, private utilsService:UtilsService, private authService:AuthService, private formBuilder: FormBuilder, private router: Router, private titleService: TitleService) {
    
  }

  fetchAdminData(){
    this.utilsService.showPageLoader(environment['MESSAGES']['CHECKING-AUTHORIZATION']);//show page loader
        this.utilsService.processPostRequest('/admin/adminProfile',{adminID:localStorage.getItem('loggedinUserId')}).pipe(takeUntil(this.destroy$)).subscribe((response) => {
          this.adminData = response  
          this.croppedImage = (response['profile_pic'].length>0)?response['profile_pic']:'assets/img/avatar5.png'
          this.profileForm.patchValue({name:response['name']})
          this.profileForm.patchValue({profile_pic:response['profile_pic']})
          
        })
  }

  ngOnInit(): void {
    this.titleService.setTitle();
    this.initProfileForm();
    this.fetchAdminData()
  }

  //profile form
  private initProfileForm(){
    this.profileForm = this.formBuilder.group({
      name: [null, [Validators.required]],   
      profile_pic: [null],           
      user_id:[localStorage.getItem('loggedinUserId')]
    }
  );

  }

  fileChangeEvent(event: any): void {
    this.showCropper = true
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
      this.profileForm.patchValue({profile_pic:this.croppedImage})
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      //console.log(this.profileForm);
      this.isFormSubmitted= true
      return false;      
    }    
  

    this.utilsService.showPageLoader(environment.MESSAGES['SAVING-INFO']);//show page loader
    this.utilsService.processPostRequest('/admin/updateProfile',this.profileForm.value).pipe(takeUntil(this.destroy$)).subscribe((response) => {
      this.showCropper = false
      this.authService.isLoggedIn(true, 'admin');//trigger loggedin observable 
      this.utilsService.onSuccess(environment.MESSAGES['SUCCESSFULLY-SAVED']);
      this.router.navigate(['/home/dashboard']);
    })
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

}
