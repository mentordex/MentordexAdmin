import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';

//services
import { TitleService, UtilsService } from '../../core/services'
import { environment } from '../../../environments/environment'
import Swal from 'sweetalert2'
declare var $;

@Component({
  selector: 'app-slots',
  templateUrl: './slots.component.html',
  styleUrls: ['./slots.component.css']
})
export class SlotsComponent implements OnInit {
  
  title: string = 'Appointment Slots';
  breadcrumbs: any[] = [{ page: 'Home', link: '/home' }, { page: 'Appointment Slots', link: '' }]
  viewMoreSlots:any = []
  destroy$: Subject<boolean> = new Subject<boolean>();
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



  days:any = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Satuarday']
  slots:any = []
  selectedSlots:any=[]
  constructor(private utilsService: UtilsService, private titleService: TitleService, private formBuilder:FormBuilder) { 
 
  }

 
  ngOnInit(): void {
    this.titleService.setTitle();
    
    this.fetchListing() 

    
    this.addEditForm=this.formBuilder.group({     
      id:[null],
      day: ['', [Validators.required]],
      is_active:[true, [Validators.required]],
      slots: []     
    }) 
    this.initalizeSlots()
  }

 

  viewSlots(record){        
    this.viewMoreSlots = (record.slots).filter(slot => slot.isChecked==true  );
    $('#bmodal').modal({show:true})
         
  }

  processSlots(slots){    
    const result = slots.filter(slot => slot.isChecked==true  );
    return result;
  }

  initalizeSlots(){
    for(var i=0;i<24;i++){
      var timeFormat = (i<13)?'AM':'PM'
      i = (i<9)?parseInt(`0${i}`):i;
      

      if(i<9){
        var j = (i==0)?'12':`0${i}`
        this.slots.push({slot:`${j}:00 ${timeFormat} - 0${i+1}:00 ${timeFormat}`, isChecked:false})
      }else if(i==9){
        this.slots.push({slot:`0${i}:00 ${timeFormat} - ${i+1}:00 ${timeFormat}`, isChecked:false})
      }else{
        this.slots.push({slot:`${i}:00 ${timeFormat} - ${i+1}:00 ${timeFormat}`, isChecked:false})
      }
      
    }
  }

  setSlotsToDefault(){
    var that  = this
    this.slots.forEach(function(slot, i) {      
      that.slots[i]['isChecked'] = false
    });
    console.log('slot',this.slots)
  }


  changeSelection(event,i) {
    this.slots[i]['isChecked'] = event.target.checked  
    console.log('slots',this.slots)
  }


  statusChange(event, id){
    console.log(event.target.value, id)
    console.log(event.target.checked, id)
    this.utilsService.showPageLoader(environment['MESSAGES']['SAVING-INFO']);//show page loader
    this.utilsService.processPostRequest('/dayTimeslot/changeDayStatus',{is_active:event.target.checked,id:id}).pipe(takeUntil(this.destroy$)).subscribe((response) => {
       
      this.utilsService.onSuccess(environment.MESSAGES['DAYTIMESLOT-SUCCESSFULLY-UPDATED']); 
      this.utilsService.hidePageLoader();//hide page loader  
      this.fetchListing() 
     })
  }
  
  fetchListing(){
    this.utilsService.showPageLoader(environment.MESSAGES["FETCHING-RECORDS"]);//show page loader
   
    this.utilsService.processPostRequest('/admin/dayTimeslotListing',this.pagination).pipe(takeUntil(this.destroy$)).subscribe((response) => {
      //console.log('response',response);
      this.records = response['records'];     
      this.totalRecords = response['total_records'];     
      this.utilsService.hidePageLoader();//hide page loader
    })
  }


  editAction(record){
    this.formStatus = 'Update'
    this.isCollapsed = false;
    this.utilsService.showPageLoader(environment.MESSAGES["FETCHING-RECORD"]);//show page loader
    this.utilsService.processPostRequest('/dayTimeslot/fetchSlot',{id:record._id}).pipe(takeUntil(this.destroy$)).subscribe((response) => {      
      this.utilsService.hidePageLoader();//hide page loader  
      this.addEditForm.patchValue({ id: record._id})
      this.addEditForm.patchValue({ day: record.day}) 
      this.addEditForm.patchValue({ slots: record.slots})
      this.addEditForm.patchValue({ is_active: record.is_active}) 
      record.slots.forEach(function(v){ delete v._id }); 
      var selctedslots =   record.slots
      this.slots =   selctedslots
    })   
  }

  cancelEdit(){
    this.addEditForm.reset();  
    this.isCollapsed = true;    
    this.formStatus = 'Add'
    this.addEditForm.patchValue({ id: ''})
    this.addEditForm.patchValue({ day: ''})
    this.addEditForm.patchValue({ slots: []})
    this.addEditForm.patchValue({ is_active: true})
    //this.setSlotsToDefault()
  }

  onSubmit(){
    if (this.addEditForm.invalid) { 
      console.log('yes invalid');    
      this.isFormSubmitted= true
      return false;      
    }
    let isSlotSelected = this.slots.some(slot => slot.isChecked);
    if(!isSlotSelected){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please select time slots.'        
      })
      return false;
    } 
    this.addEditForm.patchValue({slots:this.slots})

    this.utilsService.showPageLoader(environment['MESSAGES']['SAVING-INFO']);//show page loader
    this.utilsService.processPostRequest('/dayTimeslot/add',this.addEditForm.value).pipe(takeUntil(this.destroy$)).subscribe(() => {
      if(this.addEditForm.get('id').value)        
        this.utilsService.onSuccess(environment.MESSAGES['DAYTIMESLOT-SUCCESSFULLY-UPDATED']);
      else        
        this.utilsService.onSuccess(environment.MESSAGES['DAYTIMESLOT-SUCCESSFULLY-SAVED']); 
      this.setSlotsToDefault()
      this.cancelEdit()
      this.fetchListing()
    })   
   
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

}
