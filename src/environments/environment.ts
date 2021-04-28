// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  APP_NAME:"Mentordex Admin",
  API_ENDPOINT: 'http://18.218.99.213:3000',
  MESSAGES:{
    "SUCCESSFULLY-LOGOUT":"Loggedout Successfully",
    "CHECKING-AUTHORIZATION":"Checking Authorization",
    "SAVING-INFO":"Saving Information. Please Wait..",
    "SUCCESSFULLY-SAVED":"Your information has been saved successfully.",
    "FETCHING-RECORDS":"Fetching Records",
    "SUCCESSFULLY-DELETED":"Record has been deleted successfully.",
    "CAN-NOT-DELETE":"Can not delete this record because it is attached with other records",
    "EMAIL-SENT":"Email has been sent. Please check your inbox for further instructions.",
    "STATUS-UPDATED":"Status has been updated successfully.",
    "SYSTEM-ERROR":"We got some system error. Please try again.",
    "COUNTRY-SUCCESSFULLY-SAVED":"New country has been added successfully.",
    "COUNTRY-SUCCESSFULLY-UPDATED":"The country record has been successfully updated.",
    "STATE-SUCCESSFULLY-SAVED":"New state has been added successfully.",
    "STATE-SUCCESSFULLY-UPDATED":"The state record has been successfully updated.",
    "CITY-SUCCESSFULLY-SAVED":"New city has been added successfully.",
    "CITY-SUCCESSFULLY-UPDATED":"The city record has been successfully updated.",
    "DAYTIMESLOT-SUCCESSFULLY-SAVED":"Slot has been added successfully.",
    "DAYTIMESLOT-SUCCESSFULLY-UPDATED":"Slot has been updated successfully.",
    "BANNER-SUCCESSFULLY-SAVED":"New banner has been added successfully.",
    "BANNER-SUCCESSFULLY-UPDATED":"The banner record has been successfully updated.",
    "OFFICE-SUCCESSFULLY-SAVED":"New office has been added successfully.",
    "OFFICE-SUCCESSFULLY-UPDATED":"The office record has been successfully updated.",
    "TEAM-SUCCESSFULLY-SAVED":"New team has been added successfully.",
    "TEAM-SUCCESSFULLY-UPDATED":"The team record has been successfully updated.",
    "ABOUT-SUCCESSFULLY-SAVED":"About page content has been added successfully.",
    "ABOUT-SUCCESSFULLY-UPDATED":"About  page content has been successfully updated.",
    "MEMBERSHIP-SUCCESSFULLY-SAVED":"Membership plan has been added successfully.",
    "MEMBERSHIP-SUCCESSFULLY-UPDATED":"Membership plan has been successfully updated.",
    "REVIEW-SUCCESSFULLY-SAVED":"Review plan has been added successfully.",
    "REVIEW-SUCCESSFULLY-UPDATED":"Review plan has been successfully updated.",
    
    "FETCHING-RECORD":"Fetching Record Data"
    
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
