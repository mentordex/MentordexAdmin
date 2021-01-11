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
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css']
})
export class PropertyComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>();
  isLoading:boolean = false;
  records:any = []
  totalRecords = 0;
  pagination:any = {    
    status:'',
    user_id:'',
    search:'',
    size:10,
    pageNumber:1,   
  }
  selectedStatus:string='';
  searchForm: FormGroup;
  isSearchFormSubmitted:boolean = false;
  propertyData:any = {};
  isModalOpened:boolean = false;

  constructor(private activatedRoute:ActivatedRoute, private utilsService: UtilsService, private titleService: TitleService, private formBuilder:FormBuilder) { 
 
  }
  hide(isOpened:boolean):void{
    this.isModalOpened = isOpened; //set to false which will reset modal to show on click again
     
  }


 
  ngOnInit(): void {
    this.titleService.setTitle();

    this.searchForm=this.formBuilder.group({    
      search: [null, [Validators.required]],
      status:['']
    })
    this.activatedRoute.params.subscribe((params) => {  
      //console.log('params',params)
      const status = (params['status']=='no')?'':params['status'] 
      this.selectedStatus = (status == undefined)?'':status
      //console.log('selectedStatus',this.selectedStatus);
      this.pagination['status'] = status
      this.searchForm.patchValue({status:params['status']})

      if(params['user_id']=='no'){
        this.pagination['user_id'] = params['user_id'] || ''
      }
      
      

    })


    this.fetchListing() 
    
  }

  onSearch(){
    if (this.searchForm.invalid) {     
      this.isSearchFormSubmitted= true
      return false;      
    }
    this.pagination['search'] = this.searchForm.get('search').value 
    this.fetchListing()
  }
  

  onSelectStatus(event){
    
    this.pagination['status'] = event.target.value
    if(event.target.value)
      this.searchForm.patchValue({status:event.target.value})
    else
      this.searchForm.patchValue({status:event.target.value})
      
    this.fetchListing(); 

  }
  resetSearch(){
    this.searchForm.reset();
    this.pagination['search'] = ''  
    this.pagination['status'] = ''
    this.searchForm.patchValue({status: this.pagination['status']})
    this.searchForm.patchValue({search: this.pagination['search']})
    this.fetchListing()
  }

  viewProperty(property){
    //console.log('property',property)
    this.propertyData = property
    this.isModalOpened = true;
  }

  fetchListing(){
    this.utilsService.showPageLoader(environment.MESSAGES["FETCHING-RECORDS"]);//show page loader
   
   
    this.utilsService.processPostRequest('/admin/propertyListing',this.pagination).pipe(takeUntil(this.destroy$)).subscribe((response) => {
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

  
  onChangeStatus(event, propertyid){
    //console.log('event',event.target.value);
    Swal.fire({
      title: 'Are you sure to change status?',
      text: 'You will not be able to recover this record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, change it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.utilsService.showPageLoader(environment['MESSAGES']['SAVING-INFO']);//show page loader
        this.utilsService.processPostRequest('/admin/changePropertyStatus',{status:event.target.value,propertyID:propertyid}).pipe(takeUntil(this.destroy$)).subscribe((response) => {
          if(response){
            this.utilsService.onSuccess(environment.MESSAGES['STATUS-UPDATED']);         
              
            this.fetchListing()
          }else{
            Swal.fire('Sorry...', environment.MESSAGES['SYSTEM-ERROR'], 'error')
            return false;
          }
          
        })
      } 
    })
  }
  /*delete(record){
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
        this.utilsService.processPostRequest('/admin/deleteProperty',{propertyID:record._id}).pipe(takeUntil(this.destroy$)).subscribe((response) => {
          if(response){
            this.utilsService.onSuccess(environment.MESSAGES['SUCCESSFULLY-DELETED']);         
              
            this.fetchListing()
          }else{
            Swal.fire('Sorry...', environment.MESSAGES['CAN-NOT-DELETE'], 'error')
            return false;
          }
          
        })
      } 
    })
    
  }*/

  checkTitle(title){
    if(title.length>30)
        return `${title.substr(0, 30)}...`;
    else  
      return `${title}`;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

}
