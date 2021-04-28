import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsListingComponent } from './jobs-listing.component';

describe('JobsListingComponent', () => {
  let component: JobsListingComponent;
  let fixture: ComponentFixture<JobsListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
