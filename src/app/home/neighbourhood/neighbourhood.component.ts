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
  selector: 'app-neighbourhood',
  templateUrl: './neighbourhood.component.html',
  styleUrls: ['./neighbourhood.component.css']
})
export class NeighbourhoodComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>();
  isLoading:boolean = false;
  isCollapsed:boolean = true;
  formStatus:string = 'Add'
  records:any = []
  cities:any =[]
  totalRecords = 0;
  pagination:any = {    
    city_id:'',
    search:'',
    size:10,
    pageNumber:1,   
  }
  selectedCityId:any  ='';
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
      city_id: ['', [Validators.required]],   
    })

    this.searchForm=this.formBuilder.group({    
      search: [null, [Validators.required]],
      city_id:['']
    })
    this.activatedRoute.params.subscribe((params) => {  
      const cityID =  ('cityID' in params)?params['cityID']:''
      this.selectedCityId =cityID
      this.pagination['city_id'] = cityID
      this.searchForm.patchValue({city_id:cityID})

    })
    this.fetchCities()
    this.fetchListing() 
    
  }

  fetchCities(){
    this.utilsService.processGetRequest('/city/listing').pipe(takeUntil(this.destroy$)).subscribe((response) => {
     this.cities = response    
    })
  }

  
  onSelectCity(event){
    this.selectedCityId = event.target.value
    this.pagination['city_id'] = event.target.value
    if(event.target.value)
      this.searchForm.patchValue({city_id:event.target.value})
    else
      this.searchForm.patchValue({city_id:event.target.value})
      
    this.fetchListing(); 

  }
  fetchListing(){
    this.utilsService.showPageLoader(environment.MESSAGES["FETCHING-RECORDS"]);//show page loader
   
    this.utilsService.processPostRequest('/admin/neighbourhoodListing',this.pagination).pipe(takeUntil(this.destroy$)).subscribe((response) => {
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
    this.addEditForm.patchValue({ city_id: record.city_id})
    
  }
  cancelEdit(){
    this.addEditForm.reset();
    this.addEditForm.patchValue({ city_id: ''})
    this.isCollapsed = true;    
    this.formStatus = 'Add'
  }

  resetSearch(){
    this.searchForm.reset();
    this.pagination['search'] = ''  
    this.pagination['city_id'] = this.selectedCityId
    this.searchForm.patchValue({city_id: this.selectedCityId})
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
        this.utilsService.processPostRequest('/neighbourhood/deleteNeighborhood',{id:record._id}).pipe(takeUntil(this.destroy$)).subscribe((response) => {
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
    this.utilsService.processPostRequest('/neighbourhood/add',this.addEditForm.value).pipe(takeUntil(this.destroy$)).subscribe((response) => {
      this.utilsService.onSuccess(environment.MESSAGES['SUCCESSFULLY-SAVED']); 
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
