import { Component, OnInit,NgZone } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';

import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

//services
import { TitleService, UtilsService } from '../../core/services'
import { environment } from '../../../environments/environment'
import Swal from 'sweetalert2'
import * as Dropzone from 'dropzone';
@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.css']
})
export class MembershipComponent implements OnInit {

  title: string = 'Membership Listings';
  breadcrumbs: any[] = [{ page: 'Home', link: '/home' },{page: 'Membership Listings', link: ''}]
  destroy$: Subject<boolean> = new Subject<boolean>();  
  public imageUploadconfig: DropzoneConfigInterface;
  isLoading:boolean = false;
  isCollapsed:boolean = true;
  formStatus:string = 'Add'
  records:any = []
  totalRecords = 0;
  pagination:any = {
    search:'',
    size:10,
    pageNumber:1,   
  }
  addEditForm: FormGroup;
  isFormSubmitted:boolean = false;

  searchForm: FormGroup;
  isSearchFormSubmitted:boolean = false;

 
  constructor(private utilsService: UtilsService, private titleService: TitleService, private formBuilder:FormBuilder, private ngZone: NgZone) { 
 
  }

  
  ngOnInit(): void {
    this.titleService.setTitle();
    this.fetchListing() 

    this.addEditForm=this.formBuilder.group({     
      id:[null],
      title: [null, [Validators.required, Validators.minLength(10),Validators.maxLength(100)]],
      description: [null, [Validators.required, Validators.minLength(10),Validators.maxLength(500)]],
      price: [null, [Validators.required, Validators.max(100000), Validators.min(1)]],  
      price_id:[null],
      type:['', [Validators.required]],
      product_id:[null],       
      is_active:[true], 
    })

    this.searchForm=this.formBuilder.group({    
      search: [null, [Validators.required]],
    })
    
  }

  editAction(record){
    this.formStatus = 'Update'
    this.isCollapsed = false;
    this.addEditForm.patchValue({ id: record._id})
    this.addEditForm.patchValue({ title: record.title})
    this.addEditForm.patchValue({ description: record.description})
    this.addEditForm.patchValue({ price: record.price})
    this.addEditForm.patchValue({ price_id: record.price_id})
    this.addEditForm.patchValue({ type: record.type})
    this.addEditForm.patchValue({ product_id: record.product_id})
    this.addEditForm.patchValue({ is_active: record.is_active})
    
    
  }

  statusChange(event, record){
    
    this.utilsService.showPageLoader(environment['MESSAGES']['SAVING-INFO']);//show page loader
    this.utilsService.processPostRequest('/membership/changeStatus',{is_active:event.target.checked,id:record._id,price_id:record.price_id, product_id:record.product_id}).pipe(takeUntil(this.destroy$)).subscribe((response) => {
       
      this.utilsService.onSuccess(environment.MESSAGES['MEMBERSHIP-SUCCESSFULLY-UPDATED']); 
      this.utilsService.hidePageLoader();//hide page loader  
      this.fetchListing() 
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

  

  cancelEdit(){
    this.addEditForm.reset();
    this.addEditForm.patchValue({ is_active: true})
    this.isCollapsed = true;    
    this.formStatus = 'Add'
    this.isFormSubmitted= false
  }
  onSubmit(){
    if (this.addEditForm.invalid) {     
      this.isFormSubmitted= true
      return false;      
    }
    console.log(this.addEditForm.value)
    this.utilsService.showPageLoader(environment['MESSAGES']['SAVING-INFO']);//show page loader
    this.utilsService.processPostRequest('/membership/add',this.addEditForm.value).pipe(takeUntil(this.destroy$)).subscribe((response) => {
     
      if(this.addEditForm.get('id').value)        
        this.utilsService.onSuccess(environment.MESSAGES['MEMBERSHIP-SUCCESSFULLY-UPDATED']);
      else        
        this.utilsService.onSuccess(environment.MESSAGES['MEMBERSHIP-SUCCESSFULLY-SAVED']); 

      this.cancelEdit()
      this.fetchListing()
    })
  }


  fetchListing(){
    this.utilsService.showPageLoader(environment.MESSAGES["FETCHING-RECORDS"]);//show page loader
   
    this.utilsService.processPostRequest('/membership/listing',this.pagination).pipe(takeUntil(this.destroy$)).subscribe((response) => {
      //console.log('response',response);
      this.records = response['records'];     
      this.totalRecords = response['total_records'];     
      this.utilsService.hidePageLoader();//hide page loader
    })
  }

  nextpage(page){
    this.pagination.pageNumber = page 
    this.fetchListing()
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

}

