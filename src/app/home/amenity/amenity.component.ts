import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";

//services
import { TitleService, UtilsService } from '../../core/services'
import { environment } from '../../../environments/environment'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-amenity',
  templateUrl: './amenity.component.html',
  styleUrls: ['./amenity.component.css']
})
export class AmenityComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>();
  isLoading:boolean = false;
  isCollapsed:boolean = true;
  formStatus:string = 'Add'
  records:any = []
  totalRecords = 0;
  categories:any = []

  pagination:any = {
    search:'',
    size:10,
    pageNumber:1,   
  }
  amenityForm: FormGroup;
  isFormSubmitted:boolean = false;

  searchForm: FormGroup;
  isSearchFormSubmitted:boolean = false;
  selectedCategoryId:any  ='';

  constructor(private activatedRoute:ActivatedRoute, private utilsService: UtilsService, private titleService: TitleService, private formBuilder:FormBuilder, private router:Router) { 
    this.fetchCategory();
  }

 
  ngOnInit(): void {
    this.titleService.setTitle();    
    this.fetchListing() 


    this.amenityForm=this.formBuilder.group({     
      id:[null],
      type: [null, [Validators.required]],
      description:[null,[Validators.required]],
      category_id:['', [Validators.required]],
      is_active:['No', [Validators.required]], 
    })

    this.activatedRoute.params.subscribe((params) => {  
      const categoryID =  ('categoryID' in params)?params['categoryID']:''
      this.selectedCategoryId =categoryID
      this.pagination['category_id'] = categoryID
      this.searchForm.patchValue({category_id:categoryID})

    })

    this.searchForm=this.formBuilder.group({    
      search: [null, [Validators.required]],
      category_id:['']
    })
    
  }
  onSelectCategory(event){
    this.selectedCategoryId = event.target.value
    this.pagination['category_id'] = event.target.value
    if(event.target.value)
      this.searchForm.patchValue({category_id:event.target.value})
    else
      this.searchForm.patchValue({category_id:event.target.value})
      
    this.fetchListing(); 

  }

  fetchCategory(){
    this.utilsService.processGetRequest('/faqcategory/listing').pipe(takeUntil(this.destroy$)).subscribe((response) => {
     this.categories = response    
    })
  }

  editAction(record){
   // console.log(record)
    this.amenityForm.patchValue({ id: record._id})
    this.amenityForm.patchValue({ type: record.type})
    this.amenityForm.patchValue({ description: record.description})
    this.amenityForm.patchValue({ category_id: record.category_id})
    this.amenityForm.patchValue({ is_active: record.is_active})
    
    this.formStatus = 'Update'
    this.isCollapsed = false;
  }
  cancelEdit(){
    this.amenityForm.reset();
    this.isCollapsed = true;
    this.formStatus = 'Add'
  }

  resetSearch(){
    this.searchForm.reset();
    this.pagination['search'] = ''
    this.fetchListing()
  }
  
  delete(record){

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
        this.utilsService.processPostRequest('/amenity/deleteAmenity',{id:record._id}).pipe(takeUntil(this.destroy$)).subscribe((response) => {
          if(response){
            this.utilsService.onSuccess(environment.MESSAGES['SUCCESSFULLY-DELETED']);          
            this.amenityForm.reset();
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

  fetchListing(){
    this.utilsService.showPageLoader('Fetching Records');//show page loader
   
    this.utilsService.processPostRequest('/admin/amenityListing',this.pagination).pipe(takeUntil(this.destroy$)).subscribe((response) => {
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

  onSubmit(){
    if (this.amenityForm.invalid) {     
      this.isFormSubmitted= true
      return false;      
    }
    this.utilsService.showPageLoader(environment['MESSAGES']['SAVING-INFO']);//show page loader
    this.utilsService.processPostRequest('/amenity/add',this.amenityForm.value).pipe(takeUntil(this.destroy$)).subscribe((response) => {
      this.utilsService.onSuccess(environment.MESSAGES['SUCCESSFULLY-SAVED']);          
      this.amenityForm.reset();
      this.isCollapsed = true;
      this.formStatus = 'Add'   
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

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

}
