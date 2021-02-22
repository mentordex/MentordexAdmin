import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';

//services
import { TitleService, UtilsService } from '../../core/services'
import { environment } from '../../../environments/environment'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>();
  title: string = 'Appointment Listing';
  breadcrumbs: any[] = [{ page: 'Home', link: '/home' }, { page: 'Appointments', link: '' }]
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

 
  constructor(private utilsService: UtilsService, private titleService: TitleService, private formBuilder:FormBuilder) { 
 
  }

  ngOnInit(): void {
    this.titleService.setTitle();
    this.fetchListing() 

    this.addEditForm=this.formBuilder.group({     
      name:[null,[Validators.required]],
      email: [null, [Validators.email, Validators.required]],
      phone:[null, [Validators.required]],
      date_time:[null, [Validators.required]],
      status:['',[Validators.required]]      
    })

    this.searchForm=this.formBuilder.group({    
      search: [null, [Validators.required]],
    })
 
    
  }

  editAction(record){
    this.formStatus = 'Update'
    this.isCollapsed = false;
    this.addEditForm.patchValue({ id: record._id})
    this.addEditForm.patchValue({ name: record.name})
    this.addEditForm.patchValue({ email: record.email})
    this.addEditForm.patchValue({ phone: record.phone})
    this.addEditForm.patchValue({ date_time: record.date_time})
    this.addEditForm.patchValue({ status: record.status})
    
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
      title: 'Are you sure you want to delete the appointment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.utilsService.showPageLoader(environment['MESSAGES']['SAVING-INFO']);//show page loader
        this.utilsService.processPostRequest('/appointment/deleteAppointment',{id:record._id}).pipe(takeUntil(this.destroy$)).subscribe((response) => {
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
    this.utilsService.processPostRequest('/appointment/add',this.addEditForm.value).pipe(takeUntil(this.destroy$)).subscribe((response) => {
      this.utilsService.onSuccess(environment.MESSAGES['SUCCESSFULLY-SAVED']); 
      this.cancelEdit()
      this.fetchListing()
    })
  }


  fetchListing(){
    this.totalRecords = 5
    this.records = [
      {
        name:"Test Appointment",
        email:"mentor@mailiinator.com",
        phone:"7778787778",
        date_time:'Feb 09, 2021 22:20:10',
        status:true,
        created_at:'Feb 09, 2021 22:20:10',
        modified_at:'Feb 09, 2021 22:20:10',
      },
      {
        name:"Test Appointment",
        email:"mentor@mailiinator.com",
        phone:"7778787778",
        date_time:'Feb 09, 2021 22:20:10',
        status:true,
        created_at:'Feb 09, 2021 22:20:10',
        modified_at:'Feb 09, 2021 22:20:10',
      },{
        name:"Test Appointment",
        email:"mentor@mailiinator.com",
        phone:"7778787778",
        date_time:'Feb 09, 2021 22:20:10',
        status:true,
        created_at:'Feb 09, 2021 22:20:10',
        modified_at:'Feb 09, 2021 22:20:10',
      },{
        name:"Test Appointment",
        email:"mentor@mailiinator.com",
        phone:"7778787778",
        date_time:'Feb 09, 2021 22:20:10',
        status:true,
        created_at:'Feb 09, 2021 22:20:10',
        modified_at:'Feb 09, 2021 22:20:10',
      },{
        name:"Test Appointment",
        email:"mentor@mailiinator.com",
        phone:"7778787778",
        date_time:'Feb 09, 2021 22:20:10',
        status:true,
        created_at:'Feb 09, 2021 22:20:10',
        modified_at:'Feb 09, 2021 22:20:10',
      }
    ]
    this.utilsService.showPageLoader(environment.MESSAGES["FETCHING-RECORDS"]);//show page loader
   
    this.utilsService.processPostRequest('/admin/mentorListing',{user_type:'MENTOR'}).pipe(takeUntil(this.destroy$)).subscribe((response) => {
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
