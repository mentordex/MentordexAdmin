// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  APP_NAME:"Mentordex Admin",
  API_ENDPOINT: 'http://localhost:3000',
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
    "SYSTEM-ERROR":"We got some system error. Please try again."
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
