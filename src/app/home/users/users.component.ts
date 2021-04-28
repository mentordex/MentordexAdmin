import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';

//services
import { TitleService, UtilsService } from '../../core/services'
import { environment } from '../../../environments/environment'
import Swal from 'sweetalert2'
declare var $;


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  title: string = 'Users';
  breadcrumbs: any[] = [{ page: 'Home', link: '/home' }, { page: 'Users', link: '' }]
  destroy$: Subject<boolean> = new Subject<boolean>();
  isLoading:boolean = false;
  selectedTab:string =''
  isCollapsed:boolean = true;
  formStatus:string = 'Add'
  records:any = []
  totalRecords = 0;
  pagination:any = {
    user_type:'',
    search:'',
    size:10,
    pageNumber:1,   
  }
  addEditForm: FormGroup;
  isFormSubmitted:boolean = false;

  searchForm: FormGroup;
  isSearchFormSubmitted:boolean = false;
  userInfo:any = {}

  constructor(private utilsService: UtilsService, private titleService: TitleService, private formBuilder:FormBuilder) { 
 
  }

 
  ngOnInit(): void {
    this.titleService.setTitle();
    this.fetchListing() 

    this.addEditForm=this.formBuilder.group({     
      id:[null],
      title: [null, [Validators.required]]      
    })

    this.searchForm=this.formBuilder.group({    
      search: [null, [Validators.required]],
    })
    
  }

  showUserInfo(record){
    this.userInfo = record 
    console.log('info',this.userInfo)  
    if(record.role='MENTOR') 
      $('#mentorinfoModal').modal({show:true})

    if(record.role='PARENT') 
      $('#parentinfoModal').modal({show:true})
  }

  fetchListing(){
    this.utilsService.showPageLoader('Fetching Records');//show page loader
   
    this.utilsService.processPostRequest('/admin/userListing',this.pagination).pipe(takeUntil(this.destroy$)).subscribe((response) => {
      //console.log('response',response);
      this.records = response['records'];     
      this.totalRecords = response['total_records'];     
      this.utilsService.hidePageLoader();//hide page loader
    })
  }

  changeTab(tab){
    this.selectedTab = tab
    this.pagination['user_type'] = tab;
    this.fetchListing();
  }
  editAction(record){
    this.formStatus = 'Update'
    this.isCollapsed = false;
    this.addEditForm.patchValue({ id: record._id})
    this.addEditForm.patchValue({ title: record.title})


    
  }
  cancelEdit(){
    this.addEditForm.reset();
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
        this.utilsService.processPostRequest('/admin/deleteUser',{id:record._id}).pipe(takeUntil(this.destroy$)).subscribe((response) => {
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

  changeStatus(record, status){
    Swal.fire({
      title: 'Are you sure to change login permission for user?',     
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Change it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.utilsService.showPageLoader(environment['MESSAGES']['SAVING-INFO']);//show page loader
        this.utilsService.processPostRequest('/admin/changeStatus',{id:record._id, is_active:status}).pipe(takeUntil(this.destroy$)).subscribe((response) => {
          this.utilsService.onSuccess(environment.MESSAGES['SUCCESSFULLY-SAVED']); 
          this.fetchListing()          
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
    this.utilsService.processPostRequest('/city/add',this.addEditForm.value).pipe(takeUntil(this.destroy$)).subscribe((response) => {
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
