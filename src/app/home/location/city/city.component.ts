import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";


//services
import { TitleService, UtilsService } from '../../../core/services'
import { environment } from '../../../../environments/environment'
import Swal from 'sweetalert2'




@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {
  isReset:Boolean = false
  destroy$: Subject<boolean> = new Subject<boolean>();
  title: string = 'City Listing';
  breadcrumbs: any[] = [{ page: 'Home', link: '/home' }, { page: 'Countries', link: '/home/country' }, { page: 'States', link: '/home/state' },{page: 'Cities', link: ''}]
  isLoading:boolean = false;
  isCollapsed:boolean = true;
  formStatus:string = 'Add'
  records:any = []
  countries:any =[]
  states:any =[]
  states2:any = []
  zipcodes:any=[]
  totalRecords = 0;
  pagination:any = {    
    country_id:'',
    state_id:'',
    search:'',
    size:10,
    pageNumber:1,   
  }
  selectedCountryId:any  ='';
  selectedStateId:any = '';
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
      image: [null],    
      country_id: ['', [Validators.required]], 
      state_id: ['', [Validators.required]],  
      is_active:[true,[Validators.required]],
      zipcodes:[]
    })
    
    this.searchForm=this.formBuilder.group({    
      search: [null, [Validators.required]],
      country_id:[''],
      state_id:['']
    })
    this.activatedRoute.params.subscribe((params) => {  
      const stateID =  ('stateID' in params)?params['stateID']:''
      this.selectedStateId = stateID
      this.pagination['state_id'] = stateID
      this.searchForm.patchValue({state_id:stateID})

     //this.breadcrumbs = [{ page: 'Home', link: '/home' }, { page: 'Countries', link: '/home/country' }, { page: 'States', link: '/home/state/'+stateID },{page: 'Cities', link: ''}]

      const countryID =  ('countryID' in params)?params['countryID']:''
      this.selectedCountryId =countryID
      this.pagination['country_id'] = countryID
      this.searchForm.patchValue({country_id:countryID})

    })
  
    this.fetchCountries()
    this.fetchListing() 
    this.fetchAllStates();
    
  }
  

  onAddZipcode(zipcode){
    const index = (this.zipcodes).indexOf(zipcode);
    if (index<=0) {
      this.zipcodes.push(zipcode)
      this.addEditForm.patchValue({
        zipcodes:this.zipcodes
      })
    }

   
  }
  onZipcodeRemoved(zipcode){
    const index = (this.zipcodes).indexOf(zipcode);
    if (index > -1) {
      (this.zipcodes).splice(index, 1);
      this.addEditForm.patchValue({
        zipcodes:this.zipcodes
      })
    }
  }

  

  fetchCountries(){
    this.utilsService.processGetRequest('/country/listing').pipe(takeUntil(this.destroy$)).subscribe((response) => {
     this.countries = response    
    })
  }
  fetchAllStates(){
    this.utilsService.processPostRequest('/state/listing',{}).pipe(takeUntil(this.destroy$)).subscribe((response) => {
      this.states2 = response    
     })
  }

  fetchStates(event){
    var countryID = event.target.value
    if(countryID.length>0){
      this.utilsService.processPostRequest('/state/listing',{country_id:countryID}).pipe(takeUntil(this.destroy$)).subscribe((response) => {
        this.states = response    
       })
    }
  }
  fetchCountryStates(event){
    var countryID = event.target.value
    if(countryID.length>0){
      this.utilsService.processPostRequest('/state/listing',{country_id:countryID}).pipe(takeUntil(this.destroy$)).subscribe((response) => {
        this.states2 = response    
       })
    }
  }

  onSelectstate(event){
    this.selectedStateId = event.target.value
    this.pagination['state_id'] = event.target.value
    this.searchForm.patchValue({state_id:event.target.value})      
    this.fetchListing();

  }
  

  
  onSelectCountry(event){
    this.selectedCountryId = event.target.value
    this.pagination['country_id'] = event.target.value
    this.searchForm.patchValue({country_id:event.target.value})
    if(this.selectedCountryId.length>0){
      this.utilsService.processPostRequest('/state/listing',{country_id:this.selectedCountryId}).pipe(takeUntil(this.destroy$)).subscribe((response) => {
        this.states2 = response    
       })
    }
      
    this.fetchListing(); 

  }

  updateForm(image){
    console.log('image',image)
    this.addEditForm.patchValue({image:image})

  }
  fetchListing(){
    this.utilsService.showPageLoader(environment.MESSAGES["FETCHING-RECORDS"]);//show page loader
   
    this.utilsService.processPostRequest('/admin/cityListing',this.pagination).pipe(takeUntil(this.destroy$)).subscribe((response) => {
      //console.log('response',response);
      this.records = response['records'];     
      this.totalRecords = response['total_records'];  
      if(this.totalRecords>1){
        this.title = `Cities Listing(${this.totalRecords})`
      }else{
        this.title = `City Listing(${this.totalRecords})`
      }   
      this.utilsService.hidePageLoader();//hide page loader
    })
  }

  editAction(record){
    this.formStatus = 'Update'
    this.isCollapsed = false;
    this.utilsService.processPostRequest('/state/listing',{country_id:record.country_id}).pipe(takeUntil(this.destroy$)).subscribe((response) => {
      this.states = response    
      this.addEditForm.patchValue({
        state_id:record.state_id
      })
    })

    this.addEditForm.patchValue({ id: record._id})
    this.addEditForm.patchValue({ title: record.title})
    this.addEditForm.patchValue({ image: record.image})
    this.addEditForm.patchValue({ country_id: record.country_id})
    this.addEditForm.patchValue({ is_active: record.is_active})
    this.zipcodes = record.zipcodes
    this.addEditForm.patchValue({
      zipcodes:record.zipcodes
    })
    console.log('value',this.addEditForm.value)

  }
  cancelEdit(){
    this.isReset  = true
    this.addEditForm.reset();
    this.addEditForm.patchValue({ country_id: ''}) 
    this.states = [] 
    this.addEditForm.patchValue({ is_active: true}) 
    this.addEditForm.patchValue({ state_id: ''})  
    this.isCollapsed = true;    
    this.formStatus = 'Add'
  }

  resetSearch(){
    this.searchForm.reset();
    this.pagination['search'] = ''  
    this.pagination['country_id'] = this.selectedCountryId
    this.pagination['state_id'] = this.selectedStateId
   // this.pagination['state_id'] = this.selectedStateId
    this.searchForm.patchValue({country_id: this.selectedCountryId})
    this.searchForm.patchValue({state_id: this.selectedStateId})
    this.fetchListing()
  }
  
  delete(record){
    //console.log(record)
    Swal.fire({
      title: 'Are you sure you want to delete the city',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.utilsService.showPageLoader(environment['MESSAGES']['SAVING-INFO']);//show page loader
        this.utilsService.processPostRequest('/city/deleteCity',{id:record._id}).pipe(takeUntil(this.destroy$)).subscribe((response) => {
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
    if(this.addEditForm.get('image').value == null){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please add an image'        
      })
      return false;
    } 

    if(this.addEditForm.get('zipcodes').value == null){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please add atleast single zipcode'        
      })
      return false;
    } 
    
    this.utilsService.showPageLoader(environment['MESSAGES']['SAVING-INFO']);//show page loader
    this.utilsService.processPostRequest('/city/add',this.addEditForm.value).pipe(takeUntil(this.destroy$)).subscribe(() => {
      if(this.addEditForm.get('id').value)        
        this.utilsService.onSuccess(environment.MESSAGES['CITY-SUCCESSFULLY-UPDATED']);
      else        
        this.utilsService.onSuccess(environment.MESSAGES['CITY-SUCCESSFULLY-SAVED']); 
      this.zipcodes = []
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
