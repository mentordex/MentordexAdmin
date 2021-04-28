import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//services
import { TitleService, UtilsService } from '../../core/services'


@Component({
  selector: 'app-jobs-listing',
  templateUrl: './jobs-listing.component.html',
  styleUrls: ['./jobs-listing.component.css']
})
export class JobsListingComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>();
  title: string = 'Jobs Listing';
  breadcrumbs: any[] = [{ page: 'Home', link: '/home' }, { page: 'Jobs Listing', link: '' }]
  isLoading:boolean = false;
  isCollapsed:boolean = true;
  formStatus:string = 'Add'
  records:any = []
  totalRecords = 0;
  addEditForm: FormGroup;
  isFormSubmitted:boolean = false;
  pagination:any = {
    search:'',
    size:10,
    pageNumber:1,   
  }

  searchForm: FormGroup;
  isSearchFormSubmitted:boolean = false;
  
  constructor(private utilsService:UtilsService, private formBuilder: FormBuilder, private titleService: TitleService) {
 
  }

 
  ngOnInit(): void {
    this.titleService.setTitle();
    this.fetchListing() 
    this.searchForm=this.formBuilder.group({    
      search: [null, [Validators.required]],
    })
  }

  fetchListing(){
    this.utilsService.showPageLoader('Fetching Records');//show page loader
   
    this.utilsService.processPostRequest('/admin/jobsListing',this.pagination).pipe(takeUntil(this.destroy$)).subscribe((response) => {
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

 

  resetSearch(){
    this.searchForm.reset();
    this.pagination['search'] = '' 
  
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
  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

}
