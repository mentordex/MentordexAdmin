import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";

//services
import { TitleService, UtilsService } from '../../../core/services'
import { environment } from '../../../../environments/environment'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.css']
})
export class StateComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>();
  isLoading:boolean = false;
  isCollapsed:boolean = true;
  formStatus:string = 'Add'
  records:any = []
  countries:any =[]
  totalRecords = 0;
  pagination:any = {    
    country_id:'',
    search:'',
    size:10,
    pageNumber:1,   
  }
  selectedCountryId:any  ='';
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
      country_id: ['', [Validators.required]],  
      is_active:[true,[Validators.required]] 
    })

    this.searchForm=this.formBuilder.group({    
      search: [null, [Validators.required]],
      country_id:['']
    })
    this.activatedRoute.params.subscribe((params) => {  
      const countryID =  ('countryID' in params)?params['countryID']:''
      this.selectedCountryId =countryID
      this.pagination['country_id'] = countryID
      this.searchForm.patchValue({country_id:countryID})

    })
    this.fetchCountries()
    this.fetchListing() 
    
  }

  

  fetchCountries(){
    this.utilsService.processGetRequest('/country/listing').pipe(takeUntil(this.destroy$)).subscribe((response) => {
     this.countries = response    
    })
  }

  
  onSelectCountry(event){
    this.selectedCountryId = event.target.value
    this.pagination['country_id'] = event.target.value
    if(event.target.value)
      this.searchForm.patchValue({country_id:event.target.value})
    else
      this.searchForm.patchValue({country_id:event.target.value})
      
    this.fetchListing(); 

  }
  fetchListing(){
    this.utilsService.showPageLoader(environment.MESSAGES["FETCHING-RECORDS"]);//show page loader
   
    this.utilsService.processPostRequest('/admin/stateListing',this.pagination).pipe(takeUntil(this.destroy$)).subscribe((response) => {
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
    this.addEditForm.patchValue({ country_id: record.country_id})
    this.addEditForm.patchValue({ is_active: record.is_active})

  }
  cancelEdit(){
    this.addEditForm.reset();
    this.addEditForm.patchValue({ country_id: ''})  
    this.addEditForm.patchValue({ is_active: true}) 
    this.isCollapsed = true;    
    this.formStatus = 'Add'
  }

  resetSearch(){
    this.searchForm.reset();
    this.addEditForm.patchValue({ country_id: ''})
    this.addEditForm.patchValue({ is_active: true})
    this.pagination['search'] = ''  
    this.pagination['country_id'] = this.selectedCountryId
    this.searchForm.patchValue({country_id: this.selectedCountryId})
    this.fetchListing()
  }
  
  delete(record){
    //console.log(record)
    Swal.fire({
      title: 'Are you sure you want to delete the state',
      text: 'All the cities for this state will be deleted as well.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.utilsService.showPageLoader(environment['MESSAGES']['SAVING-INFO']);//show page loader
        this.utilsService.processPostRequest('/state/deleteState',{id:record._id}).pipe(takeUntil(this.destroy$)).subscribe((response) => {
          if(response){
            this.utilsService.onSuccess(environment.MESSAGES['SUCCESSFULLY-DELETED']);          
            this.addEditForm.reset();
            this.addEditForm.patchValue({ country_id: ''})
            this.addEditForm.patchValue({ is_active: true})
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
    this.utilsService.processPostRequest('/state/add',this.addEditForm.value).pipe(takeUntil(this.destroy$)).subscribe((response) => {
      if(this.addEditForm.get('id').value)        
        this.utilsService.onSuccess(environment.MESSAGES['STATE-SUCCESSFULLY-UPDATED']);
      else        
        this.utilsService.onSuccess(environment.MESSAGES['STATE-SUCCESSFULLY-SAVED']); 
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
