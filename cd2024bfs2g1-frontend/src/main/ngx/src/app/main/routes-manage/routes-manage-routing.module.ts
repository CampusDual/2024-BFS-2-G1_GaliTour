import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageAllPacksComponent } from '../manage-packages/manage-all-packs/manage-all-packs.component';
import { PackEditComponent } from '../manage-packages/pack-edit/pack-edit.component';
import { ManageAllRoutesComponent } from './manage-all-routes/manage-all-routes.component';
import { EditRouteComponent } from './edit-route/edit-route.component';

const routes: Routes = [
  {
    path: '', component: ManageAllRoutesComponent,  data: {
      // oPermission: {
      //   permissionId: 'managepacks',
      //   restrictedPermissionsRedirect: '403'
      // }
    }
  
  },
  {
    path: ':route_id', component: EditRouteComponent, 
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoutesManageRoutingModule {
 
  
 }
