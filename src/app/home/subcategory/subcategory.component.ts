import { Component, OnInit, NgZone } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

//services
import { TitleService, UtilsService } from '../../core/services'
import { environment } from '../../../environments/environment'
import Swal from 'sweetalert2'
import * as Dropzone from 'dropzone';

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.css']
})
export class SubcategoryComponent implements OnInit {
  title: string = 'Subcategory Listing';
  breadcrumbs: any[] = [{ page: 'Home', link: '/home' }, { page: 'Subcategories', link: '' }]

  destroy$: Subject<boolean> = new Subject<boolean>();
  public imageUploadconfig: DropzoneConfigInterface;
  isLoading:boolean = false;
  isCollapsed:boolean = true;
  formStatus:string = 'Add'
  records:any = []
  categories:any =[]
  totalRecords = 0;
  pagination:any = {    
    category_id:'',
    search:'',
    size:10,
    pageNumber:1,   
  }
  selectedCategoryId:any  ='';
  addEditForm: FormGroup;
  isFormSubmitted:boolean = false;

  searchForm: FormGroup;
  isSearchFormSubmitted:boolean = false;

  uploadedImage:string=''

  constructor(private activatedRoute:ActivatedRoute, private utilsService: UtilsService, private titleService: TitleService, private formBuilder:FormBuilder, private ngZone: NgZone) { 
    
  }

 
  private imageUploadConfigInit() {
    const componentObj = this;
    this.imageUploadconfig = {
      clickable: true,
      paramName: "file",
      uploadMultiple: false,
      url: environment.API_ENDPOINT + "/api/uploadImage",
      maxFiles: 1,
      autoReset: null,
      errorReset: null,
      cancelReset: null,
      //acceptedFiles: '.jpg, .png, .jpeg',
      maxFilesize: 2, // MB,
      dictDefaultMessage: '<div class="portfolio_upload"><div class="icon"><span class="flaticon-download"></span></div><p>Image thumbnail(300*200)</p></div>', 
     // previewsContainer: "#vehicleImagesPreview",        
      addRemoveLinks: false,
      //createImageThumbnails:false,
      dictInvalidFileType: 'Only valid jpeg, jpg, png file is accepted.',
      dictFileTooBig: 'Maximum upload file size limit is 2MB',
      headers: {
        'Cache-Control': null,
        'X-Requested-With': null
      },
      accept: function (file, done) {
        const reader = new FileReader();
        const _this = this
        reader.onload = function (event) {
          
          componentObj.utilsService.showPageLoader();//start showing page loader
          done();

        };
        reader.readAsDataURL(file);
      },
      init: function () {      


        this.on('sending', function (file, xhr, formData) {
          componentObj.utilsService.showPageLoader();//start showing page loader 
          
          formData.append('folder', 'subcategory');
          formData.append('fileType', file.type);
          componentObj.utilsService.showPageLoader();//start showing page loader 
         
        });
        this.on("totaluploadprogress", function (progress) {
          componentObj.utilsService.showPageLoader('Uploading file ' + parseInt(progress) + '%')
          if (progress >= 100) {
            componentObj.utilsService.hidePageLoader();//hide page loader
          }
        })

        this.on("success", function (file, response) {
          // Called after the file successfully uploaded. 
          componentObj.ngZone.run(() => {
              componentObj.uploadedImage = response.file
              componentObj.addEditForm.patchValue({ image: response.file})
              componentObj.addEditForm.patchValue({image_object:{ file_path: response.file, file_name: response.fileName, file_key: response.fileKey, file_mimetype: response.fileMimeType, file_category: 'subcategory' }})
          });
          console.log('response.fileLocation',response);
          this.removeFile(file);
          componentObj.utilsService.hidePageLoader();//hide page loader
        });

        this.on("error", function(file, serverResponse) { 
          this.removeFile(file);              
          componentObj.utilsService.onError(serverResponse);//hide page loader  
          componentObj.utilsService.hidePageLoader();//hide page loader
          //componentObj.toastr.errorToastr(serverResponse, 'Oops!');         
        });
        
      }
    };
  }

  ngOnInit(): void {
    this.titleService.setTitle();

    this.addEditForm=this.formBuilder.group({     
      id:[null],
      title: [null, [Validators.required]],    
      category_id: ['', [Validators.required]],  
      image:[],
      image_object:[],
      is_active:[true], 
    })
    this.imageUploadConfigInit();
    this.searchForm=this.formBuilder.group({    
      search: [null, [Validators.required]],
      category_id:['']
    })
    this.activatedRoute.params.subscribe((params) => {  
      const categoryID =  ('categoryID' in params)?params['categoryID']:''
      this.selectedCategoryId =categoryID
      this.pagination['category_id'] = categoryID
      this.searchForm.patchValue({category_id:categoryID})

    })
    this.fetchCategories()
    this.fetchListing() 
    
  }


  fetchCategories(){
    this.utilsService.processGetRequest('/category/listing').pipe(takeUntil(this.destroy$)).subscribe((response) => {
     this.categories = response    
    })
  }

  
  onSelectCategory(event){
    this.selectedCategoryId = event.target.value
    this.pagination['category_id'] = event.target.value
    if(event.target.value)
      this.searchForm.patchValue({category_id:event.target.value})
    else
      this.searchForm.patchValue({category_id:event.target.value})
      
    this.fetchListing(); 

  }
  fetchListing(){
    this.utilsService.showPageLoader(environment.MESSAGES["FETCHING-RECORDS"]);//show page loader
   
    this.utilsService.processPostRequest('/admin/subcategoryListing',this.pagination).pipe(takeUntil(this.destroy$)).subscribe((response) => {
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
    this.addEditForm.patchValue({ category_id: record.category_id})
    this.addEditForm.patchValue({ image: record.image})
    this.addEditForm.patchValue({ is_active: record.is_active})
    
    this.uploadedImage = record.image
    this.addEditForm.patchValue({ image_object: record.image_object})  
  }
  cancelEdit(){
    this.addEditForm.reset();
    this.addEditForm.patchValue({ category_id: ''})
    this.addEditForm.patchValue({ image: ''})
    this.addEditForm.patchValue({ image_object: ''}) 
    this.addEditForm.patchValue({ is_active: true}) 
    
    this.uploadedImage = ''   
    this.isCollapsed = true;    
    this.formStatus = 'Add'
  }

  resetSearch(){
    this.searchForm.reset();
    this.pagination['search'] = ''  
    this.pagination['category_id'] = this.selectedCategoryId
    this.searchForm.patchValue({category_id: this.selectedCategoryId})
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
        this.utilsService.processPostRequest('/subcategory/deleteSubcategory',{id:record._id}).pipe(takeUntil(this.destroy$)).subscribe((response) => {
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
    console.log('image',this.addEditForm.get('image').value)
    if(this.addEditForm.get('image').value==null || (this.addEditForm.get('image').value).length<=0){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please add an image'        
      })
      return false;
    }
    this.utilsService.showPageLoader(environment['MESSAGES']['SAVING-INFO']);//show page loader
    this.utilsService.processPostRequest('/subcategory/add',this.addEditForm.value).pipe(takeUntil(this.destroy$)).subscribe((response) => {
      this.utilsService.onSuccess(environment.MESSAGES['SUCCESSFULLY-SAVED']); 
      this.ngZone.run(() => {
        this.uploadedImage = ''
      });
      this.cancelEdit()
      this.fetchListing()
    })
  }
  statusChange(event, id){
    console.log(event.target.value, id)
    console.log(event.target.checked, id)
    this.utilsService.showPageLoader(environment['MESSAGES']['SAVING-INFO']);//show page loader
    this.utilsService.processPostRequest('/subcategory/changeSubcategoryStatus',{is_active:event.target.checked,id:id}).pipe(takeUntil(this.destroy$)).subscribe((response) => {
       
      this.utilsService.onSuccess(environment.MESSAGES['SUCCESSFULLY-UPDATED']); 
      this.utilsService.hidePageLoader();//hide page loader  
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
