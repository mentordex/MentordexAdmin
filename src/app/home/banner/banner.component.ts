import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
//services
import { TitleService, UtilsService } from '../../core/services'
import { environment } from '../../../environments/environment'
import Swal from 'sweetalert2'
@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {
isReset:Boolean = false
  destroy$: Subject<boolean> = new Subject<boolean>();
  title: string = 'Banner Listing';
  breadcrumbs: any[] = [{ page: 'Home', link: '/home' },{page: 'Banner Listing', link: ''}]
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


  constructor(private activatedRoute:ActivatedRoute, private utilsService: UtilsService, private titleService: TitleService, private formBuilder:FormBuilder) { 
    
  }

 
  ngOnInit(): void {
    this.titleService.setTitle();

    this.addEditForm=this.formBuilder.group({     
      id:[null],
      title: [null, [Validators.required]],  
      description:[null, [Validators.required]],   
      image:[null],    
      button_text: ['', [Validators.required]], 
      button_link: ['', [Validators.required]],  
      video_button_text: ['', [Validators.required]], 
      video_button_link: ['', [Validators.required]],  
      is_active:[true,[Validators.required]]
    })
    
    this.searchForm=this.formBuilder.group({    
      search: [null, [Validators.required]]
    })
    this.fetchListing()    
  }
  

  statusChange(event, id){
    console.log(event.target.value, id)
    console.log(event.target.checked, id)
    this.utilsService.showPageLoader(environment['MESSAGES']['SAVING-INFO']);//show page loader
    this.utilsService.processPostRequest('/banner/changeStatus',{is_active:event.target.checked,id:id}).pipe(takeUntil(this.destroy$)).subscribe((response) => {
       
      this.utilsService.onSuccess(environment.MESSAGES['BANNER-SUCCESSFULLY-UPDATED']); 
      this.utilsService.hidePageLoader();//hide page loader  
      this.fetchListing() 
     })
  }

  fetchListing(){
    this.utilsService.showPageLoader(environment.MESSAGES["FETCHING-RECORDS"]);//show page loader
   
    this.utilsService.processPostRequest('/admin/bannerListing',this.pagination).pipe(takeUntil(this.destroy$)).subscribe((response) => {
      //console.log('response',response);
      this.records = response['records'];     
      this.totalRecords = response['total_records'];  
        
      this.utilsService.hidePageLoader();//hide page loader
    })
  }

  editAction(record){
    this.formStatus = 'Update'
    this.isCollapsed = false;
    

    this.addEditForm.patchValue({ id: record._id})
    this.addEditForm.patchValue({ title: record.title})
    this.addEditForm.patchValue({ image: record.image})
    this.addEditForm.patchValue({ description: record.description})
    this.addEditForm.patchValue({ is_active: record.is_active})
    this.addEditForm.patchValue({ button_text: record.button_text})
    this.addEditForm.patchValue({ button_link: record.button_link})
    this.addEditForm.patchValue({ video_button_link: record.video_button_link})
    this.addEditForm.patchValue({ video_button_text: record.video_button_text})
    
    console.log('value',this.addEditForm.value)

  }
  cancelEdit(){
    this.isReset  = true
    this.addEditForm.reset();  
    this.isCollapsed = true;    
    this.formStatus = 'Add'
  }

  resetSearch(){
    this.searchForm.reset();
    this.pagination['search'] = ''  
    this.fetchListing()
  }
  
  

 updateForm(image){
    console.log('image',image)
    this.addEditForm.patchValue({image:image})

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
    if(this.addEditForm.get('image').value == null){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please add an image'        
      })
      return false;
    }   
    
    this.utilsService.showPageLoader(environment['MESSAGES']['SAVING-INFO']);//show page loader
    this.utilsService.processPostRequest('/banner/add',this.addEditForm.value).pipe(takeUntil(this.destroy$)).subscribe(() => {
      if(this.addEditForm.get('id').value)        
        this.utilsService.onSuccess(environment.MESSAGES['BANNER-SUCCESSFULLY-UPDATED']);
      else        
        this.utilsService.onSuccess(environment.MESSAGES['BANNER-SUCCESSFULLY-SAVED']); 
     
      this.cancelEdit()
      this.fetchListing()
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
