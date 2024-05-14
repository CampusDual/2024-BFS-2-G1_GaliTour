import { MenuRootItem } from 'ontimize-web-ngx';
import { BusinessHomeComponent } from '../main/business/business-home/business-home.component';

export const MENU_CONFIG: MenuRootItem[] = [
  { id: 'home', name: 'HOME', icon: 'home', route: '/main/home' },
  { id: 'businesses', name: 'BUSINESSES', tooltip: 'BUSINESSES', route: '/main/businesses', icon: 'business'},
  { id: 'packmd', name: 'PACKS', tooltip: 'PACKS', icon: 'inventory_2',
    items: [
     { id: 'packs', name: 'PACKS', tooltip: 'PACKS', route: '/main/packs', icon: 'inventory_2'},
      { id: 'mypacks', name: 'My Packs', tooltip: 'My Packs', route: '/main/pack-client', icon: 'backpack' }
    ]
    },
  { id: 'routes', name: 'ROUTES', icon: 'route', route: '/main/routes' },
  { id: 'packs', name:'PACKS', icon: 'inventory_2', route: '/main/pack'},
  {
    id: 'admin', name: 'ADMIN', tooltip: 'ADMIN', icon: 'admin_panel_settings',
    items: [
      { id: 'roles', name: 'ROLES', tooltip: 'ROLES', route: '/main/admin/roles', icon: 'supervisor_account' },
      { id: 'users', name: 'USERS', tooltip: 'USERS', route: '/main/admin/users', icon: 'person' }
    ]
  },
  {
    id: 'packs', name: 'PACKS', tooltip: 'PACKS', icon: 'hiking',
    items: [
      { id: 'myPacks', name: 'MY PACKS', tooltip: 'MY PACKS', route: '/main/pack/pack-client', icon: 'backpack' },
    ]
  },
  { id: 'logout', name: 'LOGOUT', route: '/login', icon: 'power_settings_new', confirm: 'yes' }
];
