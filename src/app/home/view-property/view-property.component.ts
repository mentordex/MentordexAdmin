import { Component, SimpleChanges, OnInit, ElementRef, Input, EventEmitter, ViewChild, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TitleService, UtilsService } from '../../core/services'

declare let $: any;

@Component({
  selector: 'app-view-property',
  templateUrl: './view-property.component.html',
  styleUrls: ['./view-property.component.css']
})
export class ViewPropertyComponent implements OnInit {
  @Input() isOpen: any; 
  @Input() propertyData: any;  
  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();  
  @ViewChild('contentSection') contentSection :ElementRef;  
  destroy$: Subject<boolean> = new Subject<boolean>();
  aminities:any = []
  constructor(private utilsService: UtilsService,) { }

  ngOnInit(): void {
    this.utilsService.processGetRequest('/amenity/listing').pipe(takeUntil(this.destroy$)).subscribe((response) => {
      this.aminities = response        
    
     })
  }

  
  
  ngOnChanges(changes: SimpleChanges) { 
    
    if(this.isOpen){     
   
      $(this.contentSection.nativeElement).modal({backdrop: 'static', keyboard: false, show: true}); 

    }     

  }

  checkAmenity(id){
   
    if(('aminities' in this.propertyData) && this.propertyData['aminities'].includes(id)){
     // console.log('yes',id)
      return true
    }else{
      return false
    }
  }

  close() {
    this.isOpen = false
    this.onClose.emit(false);    
  } 
  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }


}
