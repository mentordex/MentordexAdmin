import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UtilsService } from '../../core/services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>();
  dashboard:any={};

  constructor(private utilsService: UtilsService) { 
    
  }


  ngOnInit(): void {
    this.utilsService.showPageLoader('Fetching Dashboard Data');//show page loader
   
    this.utilsService.processPostRequest('/admin/dashboard',{}).pipe(takeUntil(this.destroy$)).subscribe((response) => {
     // console.log('response',response);
      this.dashboard = response['data'];           
      this.utilsService.hidePageLoader();//hide page loader
    })
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

}
