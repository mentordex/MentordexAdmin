export const adminLteConf = {
  skin: 'blue',
  // isSidebarLeftCollapsed: false,
  // isSidebarLeftExpandOnOver: false,
  // isSidebarLeftMouseOver: false,
  // isSidebarLeftMini: true,
  // sidebarRightSkin: 'dark',
  // isSidebarRightCollapsed: true,
  // isSidebarRightOverContent: true,
  // layout: 'normal',
  sidebarLeftMenu: [
    {label: 'Dashboard', route: 'home/dashboard', iconClasses: 'fa fa-dashboard'},
    {label: 'Admin Listing', route: 'home/admins', iconClasses: 'fa fa-user'},
   /* {label: 'Properties', route: 'home/property', iconClasses: 'fa fa-home'},*/


    {label: 'Listing NAVIGATION', separator: true},
    
    {label: 'User Listing', route: 'home/users', iconClasses: 'fa fa-user'},
    {label: 'Job Category Listing', route: 'home/city', iconClasses: 'fa fa-tasks'},
    {label: 'Skills Listing', route: 'home/neighbourhood', iconClasses: 'fa fa-users'},
    /*{label: 'Property Type Listing', route: 'home/property-type', iconClasses: 'fa fa-tasks'},*/
    {label: `FAQ's Listing`, route: 'home/faqs', iconClasses: 'fa fa-tasks'},
    {label: `Offices Listing`, route: 'home/offices', iconClasses: 'fa fa-tasks'},
    {label: 'Other Actions', separator: true},
    {label: 'Profile', route: 'home/profile', iconClasses: 'fa fa-tasks'},
    {label: 'Change Password', route: 'home/change-password', iconClasses: 'fa fa-tasks'},
  ]
};
