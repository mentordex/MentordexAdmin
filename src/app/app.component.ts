import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'angular-admin-lte';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  public customLayout: boolean;

  constructor(
    private layoutService: LayoutService
  ) {}

  ngOnInit() {
    this.layoutService.isCustomLayout.subscribe((value: boolean) => {
     // console.log('customLayout',this.customLayout)
      if (localStorage.getItem('loggedinUserId')) {
        this.customLayout = false;
      }else{
        this.customLayout = true;
      }
      
    });
  }
}
