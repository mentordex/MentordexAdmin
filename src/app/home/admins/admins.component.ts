import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//services
import { AuthService, TitleService, UtilsService } from '../../core/services'
import { fadeInAnimation } from '../../core/animations';
//import custom validators
import { CustomValidators } from '../../core/custom-validators';
import { environment } from '../../../environments/environment'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.css']
})
export class AdminsComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>();
  title: string = 'Admin Listing';
  breadcrumbs: any[] = [{ page: 'Home', link: '/home' }, { page: 'Admin Listing', link: '' }]
  isLoading:boolean = false;
  isCollapsed:boolean = true;
  formStatus:string = 'Add'
  records:any = []
  totalRecords = 0;
  addEditForm: FormGroup;
  isFormSubmitted:boolean = false;
  pagination:any = {
    search:'',
    size:10,
    pageNumber:1,   
  }

  searchForm: FormGroup;
  isSearchFormSubmitted:boolean = false;
  
  constructor(private utilsService:UtilsService, private authService:AuthService, private formBuilder: FormBuilder, private titleService: TitleService) {
 
  }

 
  ngOnInit(): void {
    this.titleService.setTitle();
    this.fetchListing() 
    
    this.addEditForm=this.formBuilder.group({     
        id:[null],
      
        name: ['', [Validators.required]],
        email: ['', [Validators.email, Validators.required]],
        password: [null, [Validators.required,Validators.minLength(10),Validators.maxLength(50)]],
        repassword: [null, [Validators.required, Validators.minLength(10),Validators.maxLength(50)]]      
      },{
        // check whether our password and confirm password match
        validators: CustomValidators.passwordMatchValidator
     
    })

    this.searchForm=this.formBuilder.group({    
      search: [null, [Validators.required]],
    })
  }

  fetchListing(){
    this.utilsService.showPageLoader('Fetching Records');//show page loader
   
    this.utilsService.processPostRequest('/admin/listing',this.pagination).pipe(takeUntil(this.destroy$)).subscribe((response) => {
      //console.log('response',response);
      this.records = response['records'];     
      this.totalRecords = response['total_records'];     
      this.utilsService.hidePageLoader();//hide page loader
    })
  }

  changeStatus(record, status){
    Swal.fire({
      title: 'Are you sure to change login permission for admin?',     
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Change it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.utilsService.showPageLoader(environment['MESSAGES']['SAVING-INFO']);//show page loader
        this.utilsService.processPostRequest('/admin/changeAdminStatus',{id:record._id, is_active:status}).pipe(takeUntil(this.destroy$)).subscribe((response) => {
          this.utilsService.onSuccess(environment.MESSAGES['SUCCESSFULLY-SAVED']); 
          this.fetchListing()          
        })
      } 
    })
  }



  nextpage(page){
    this.pagination.pageNumber = page 
    this.fetchListing()
  }

  editAction(record){
    this.formStatus = 'Update'
    this.isCollapsed = false;
    this.addEditForm.patchValue(record)  
    this.addEditForm.patchValue({id:record._id}) 
    this.addEditForm.patchValue({name:record.name}) 
    this.addEditForm.patchValue({email:record.email}) 
    this.addEditForm.patchValue({password:'1234567890'}) 
    this.addEditForm.patchValue({repassword:'1234567890'}) 
    const password = this.addEditForm.get('password');
    const repassword = this.addEditForm.get('repassword');
    
    
    
  }
  cancelEdit(){
    this.addEditForm.reset();
    this.addEditForm.patchValue({ role: ''})
    this.addEditForm.patchValue({id:''}) 
    this.isCollapsed = true;    
    this.formStatus = 'Add'
  }

  resetSearch(){
    this.searchForm.reset();
    this.pagination['search'] = '' 
  
    this.fetchListing()
  }
  
  delete(record){
    //console.log(record)
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.utilsService.showPageLoader(environment['MESSAGES']['SAVING-INFO']);//show page loader
        this.utilsService.processPostRequest('/admin/deleteAdmin',{id:record._id}).pipe(takeUntil(this.destroy$)).subscribe((response) => {
          if(response){
            this.utilsService.onSuccess(environment.MESSAGES['SUCCESSFULLY-DELETED']);          
            this.addEditForm.reset();
            this.isCollapsed = true;
            this.formStatus = 'Add'   
            this.fetchListing()
          }else{
            Swal.fire('Sorry...', environment.MESSAGES['CAN-NOT-DELETE'], 'error')
            return false;
          }
          
        })
      } 
    })
    
  }

  onSearch(){
    if (this.searchForm.invalid) {     
      this.isSearchFormSubmitted= true
      return false;      
    }
    this.pagination['search'] = this.searchForm.get('search').value 
    this.fetchListing()
  }
  onSubmit(){
    if (this.addEditForm.invalid) {     
        this.isFormSubmitted= true
      return false;      
    }
    this.utilsService.showPageLoader(environment['MESSAGES']['SAVING-INFO']);//show page loader
    this.utilsService.processPostRequest('/admin/addUpdateAdmin',this.addEditForm.value).pipe(takeUntil(this.destroy$)).subscribe((response) => {
      this.utilsService.onSuccess(environment.MESSAGES['SUCCESSFULLY-SAVED']); 
      
      this.cancelEdit()
    //  this.isCollapsed = true; 
      this.fetchListing()
    })
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

}
