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
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>();
  title: string = 'Appointments';
  breadcrumbs: any[] = [{ page: 'Home', link: '/home' }, { page: 'Appointments', link: '' }]
  isLoading:boolean = false;
  isCollapsed:boolean = true;
  formStatus:string = 'Add'
  records:any = []
  totalRecords = 0;
  pagination:any = {
    search:'',
    from:'',
    to:'',
    size:10,
    pageNumber:1, 
    status:'ALL'  
  }
 
  status:string = 'ALL'
  searchForm: FormGroup;
  isSearchFormSubmitted:boolean = false;
  mentorInfo:any;

  bookASlotForm: FormGroup;
  isFormSubmitted: boolean = false
  getCurrentDate: Date = new Date();
  minDate: Date;
  maxDate: Date;
  fromDate:Date;
  maxSearchDate:Date;
  toDate:Date;
  base64StringFile: any;
  disabled: boolean = false
  getCurrentDay: any = '';
  getAvailableSlots: any = [];

 
  constructor(private utilsService: UtilsService, private titleService: TitleService, private formBuilder:FormBuilder) { 
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.getCurrentDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date().getDay()]
  }

  ngOnInit(): void {
    this.titleService.setTitle();
    this.fetchListing() 
   
    this.getAvailableSlotsByDay(this.getCurrentDay);

  
    this.searchForm=this.formBuilder.group({    
      search: [null, [Validators.required]],
      from:[null, [Validators.required]],
      to:[null, [Validators.required]]
    })

    this.bookASlotForm = this.formBuilder.group({
      userID:[],
      appointment_date: ['', [Validators.required]],
      appointment_time: ['', [Validators.required]] ,
      notes:['', [Validators.required]],
      status:['', [Validators.required]],

    });
    
  }
  onChangeStatus(){
    if(this.bookASlotForm.get('status').value == 'RESCHEDULED'){
      this.bookASlotForm.controls['appointment_date'].setValidators([Validators.required]);       
      this.bookASlotForm.controls['appointment_time'].setValidators([Validators.required]);  
              
    }else {              
      
      this.bookASlotForm.controls["appointment_date"].clearValidators(); 
      this.bookASlotForm.controls["appointment_time"].clearValidators();
                 
    }
    this.bookASlotForm.controls["appointment_date"].updateValueAndValidity();     
    this.bookASlotForm.controls["appointment_time"].updateValueAndValidity();
  }

  /**
   * get Available Slots By Day
  */
 getAvailableSlotsByDay(day): void {
  this.utilsService.processPostRequest('/dayTimeslot/getAvailableSlots', { day: day }).pipe(takeUntil(this.destroy$)).subscribe((response) => {
    //console.log('response', response);
    let getSlots = response['slots'];
    if (getSlots == false) {
      this.getAvailableSlots = [];
    } else {
      this.getAvailableSlots = getSlots.filter(function (item) {
        return item.isChecked !== false;
      });
    }
    //console.log('response', this.getAvailableSlots);
  })
}

onChangeSearch(){
  this.searchForm.controls['to'].clearValidators()
  this.searchForm.controls["to"].updateValueAndValidity();
  this.searchForm.controls['from'].clearValidators()
  this.searchForm.controls["from"].updateValueAndValidity();
}
onFromDateChange(value: Date): void {
  if(value){
    this.fromDate = new Date(value);
  
  this.pagination['from'] = this.fromDate.getFullYear() + '-' + (this.fromDate.getMonth()+1) + '-' +(this.fromDate.getDate())+' 00:00:00';

  this.searchForm.controls['to'].setValidators([Validators.required]);
  this.searchForm.controls["to"].updateValueAndValidity();

  this.searchForm.controls["search"].clearValidators(); 
  this.searchForm.controls["search"].updateValueAndValidity();
  }
  
  
}
onToDateChange(value: Date): void {
  if(value){
    this.toDate = new Date(value);
    this.maxSearchDate = new Date(value);
  this.pagination['to'] = this.toDate.getFullYear() + '-' + (this.toDate.getMonth()+1) + '-' + (this.toDate.getDate())+' 23:59:59';
  this.searchForm.controls['from'].setValidators([Validators.required]);
  this.searchForm.controls["from"].updateValueAndValidity();
 
  this.searchForm.controls["search"].clearValidators(); 
  this.searchForm.controls["search"].updateValueAndValidity();
  }
  
}

onDateChange(value: Date): void {


    let selectedDate = new Date(value);


    let formatDate = selectedDate.getDate() + '/' + selectedDate.getMonth() + '/' + selectedDate.getFullYear();
    this.bookASlotForm.controls.appointment_date.patchValue(formatDate);

    let selectedDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][selectedDate.getDay()]
    //this.getCurrentDay = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][new Date().getDay()]
    this.getAvailableSlotsByDay(selectedDay);
  }

  
  showMentorInfo(record){
    this.mentorInfo = record
    if('notes' in this.mentorInfo)
     this.mentorInfo.notes.reverse()
    this.bookASlotForm.patchValue({
      status:record.admin_status,
      userID:record._id

    })
    this.onChangeStatus()
    $('#bmodal').modal({show:true})
  }
  

  resetSearch(){
    this.searchForm.reset();
    this.pagination['search'] = ''
    this.pagination['to'] = ''
    this.pagination['from'] = '' 
   
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
  appointments(status){
    this.status = status
    this.pagination['status']= status
    this.resetSearch()
    this.fetchListing()
  }

  onSubmit(){
    if (this.bookASlotForm.invalid) {     
      this.isFormSubmitted= true
      return false;      
    }
    this.utilsService.showPageLoader(environment['MESSAGES']['SAVING-INFO']);//show page loader
    this.utilsService.processPostRequest('/updateNotes',this.bookASlotForm.value).pipe(takeUntil(this.destroy$)).subscribe((response) => {
      this.utilsService.onSuccess(environment.MESSAGES['SUCCESSFULLY-SAVED']);          
      this.bookASlotForm.reset(); 
      $('#bmodal').modal('toggle')        
      this.fetchListing()
    })
  }

  fetchListing(){
    
    this.utilsService.showPageLoader(environment.MESSAGES["FETCHING-RECORDS"]);//show page loader
   
    this.utilsService.processPostRequest('/admin/appointments',this.pagination).pipe(takeUntil(this.destroy$)).subscribe((response) => {
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
