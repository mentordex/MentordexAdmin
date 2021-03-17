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
    {label: 'Admin Listings', route: 'home/admins', iconClasses: 'fa fa-user'},
  
    {label: 'Appointments', route: 'home/appointment', iconClasses: 'fa fa-user'},
    {label: `Appointment Slots`, route: 'home/slots', iconClasses: 'fa fa-tasks'},
    {label: 'Users', route: 'home/users', iconClasses: 'fa fa-user'},
    {label: 'Categories', route: 'home/category', iconClasses: 'fa fa-tasks'},
    {label: 'Subcategories', route: 'home/subcategory', iconClasses: 'fa fa-tasks'},
    {label: 'Countries', route: 'home/country', iconClasses: 'fa fa-tasks'},
    

    {label: "FAQ's", iconClasses: 'fa fa-tasks', children: [
      {label: "All FAQ's", route: 'home/faqs'},
      {label: 'Categories', route: 'home/faq-category'}
    ]},


  
    {label: `Office Listings`, route: 'home/offices', iconClasses: 'fa fa-tasks'},
    {label: `Team Listings`, route: 'home/team', iconClasses: 'fa fa-tasks'},   
    {label: `Banner Listings`, route: 'home/banners', iconClasses: 'fa fa-tasks'}, 
      
    {label: "CMS", iconClasses: 'fa fa-tasks', children: [
      {label: "About Us", route: 'cms/about-us'}
    ]},

    {label: 'Other Actions', separator: true},
    {label: 'Profile', route: 'home/profile', iconClasses: 'fa fa-tasks'},
    {label: 'Change Password', route: 'home/change-password', iconClasses: 'fa fa-tasks'},
  ]
};
