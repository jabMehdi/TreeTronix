import { NbMenuItem } from "@nebular/theme";

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: "SMART INDUSTRY",
    icon: "home-outline",
    link: "/pages/dashboard"
  },
  {
    title: "Factories",
    icon: "grid-outline",
    children: [
      {
        title: "Add Factory",
        link: "/pages/addfactory"
      },
      {
        title: "Add Zone",
        link: "/pages/place"
      },
      {
        title: "All Factories",
        link: "/pages/allfactory"
      }
    ]
  },
  {
    title: "Devices",
    icon: "keypad-outline",
    children: [
      {
        title: "Add Device",
        link: "/pages/addsensor"
      },
      {
        title: "All Devices",
        link: "/pages/s-devices"
      }
    ]
  },
  {
    title: "Maps",
    icon: "map-outline",
    link: "/pages/mapbox"
  },
  {
    title: "Prediction",
    icon: "edit-2-outline",
    link: "/pages/Prediction"
    // link: '/pages/stat',
  },
  {
    title: "History",
    icon: "pie-chart-outline",
    link: "/pages/charts/chartjs"
    // link: '/pages/stat',
  },
  {
    title: "Alert",
    icon: "layout-outline",
    link: "/pages/alert"
  },
   
  {
    title: "Reclamation",
    icon: "edit-2-outline",
    link: "/pages/reclamation"
  },

  {
    title: "License",
    icon: "edit-2-outline",
    link: "/pages/license"
  },

  {
    title: "Account",
    icon: "lock-outline",
    children: [
      /* {
           title: 'Login',
           link: '/auth/login',
         },*/
      {
        title: "Profile",
        link: "/auth/profile"
      }
    ]
  }
  /*
    {
      title: 'Forms',
      icon: 'edit-2-outline',
      children: [
        {
          title: 'Form Inputs',
          link: '/pages/forms/inputs',
        },
        {
          title: 'Form Layouts',
          link: '/pages/forms/layouts',
        },
        {
          title: 'Buttons',
          link: '/pages/forms/buttons',
        },
        {
          title: 'Datepicker',
          link: '/pages/forms/datepicker',
        },
      ],
    },
    {
      title: 'Modal & Overlays',
      icon: 'browser-outline',
      children: [
        {
          title: 'Dialog',
          link: '/pages/modal-overlays/dialog',
        },
        {
          title: 'Window',
          link: '/pages/modal-overlays/window',
        },
        {
          title: 'Popover',
          link: '/pages/modal-overlays/popover',
        },
        {
          title: 'Toastr',
          link: '/pages/modal-overlays/toastr',
        },
        {
          title: 'Tooltip',
          link: '/pages/modal-overlays/tooltip',
        },
      ],
    },
    {
      title: 'UI Features',
      icon: 'keypad-outline',
      link: '/pages/ui-features',
      children: [
        {
          title: 'Grid',
          link: '/pages/ui-features/grid',
        },
        {
          title: 'Icons',
          link: '/pages/ui-features/icons',
        },
        {
          title: 'Typography',
          link: '/pages/ui-features/typography',
        },
        {
          title: 'Animated Searches',
          link: '/pages/ui-features/search-fields',
        },
      ],
    },
    {
      title: 'Statestics',
      icon: 'pie-chart-outline',
      link: '/pages/stat',
    },
    {
      title: 'Stat',
      icon: 'pie-chart-outline',
      children: [
        {
          title: 'Charts.js',
          link: '/pages/charts/chartjs',
        },
      ],
    },*/
];
