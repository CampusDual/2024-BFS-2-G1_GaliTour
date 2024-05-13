import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { RouteModel } from '../../route.model';
import { RouteService } from 'src/app/shared/services/route.service';
import { FormValueOptions, OTextInputComponent } from 'ontimize-web-ngx';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-landmark',
  templateUrl: './add-landmark.component.html',
  styleUrls: ['./add-landmark.component.css']
})
export class AddLandmarkComponent implements OnInit,AfterViewInit{

onChangeValue() {
  this.routeIdInput.setData(this.routeId)
}

  @ViewChild('routeIdInput') routeIdInput: OTextInputComponent

  routeId:number

  constructor(private routeService:RouteService,
     private router: Router, private route: ActivatedRoute,
     private activeRoute:ActivatedRoute){}

  ngAfterViewInit(): void {
    this.routeIdInput.setData(this.routeId)
    // this.routeIdInput.setData(this.routeId)
    // console.log(this.routeId)
    ///////////////////////
    // if (this.routeIdInput) {
    //   const options: FormValueOptions = {
    //     emitModelToViewChange: true,
    //     emitViewToModelChange: false,
    //     emitModelToViewValueChange: true
    //   };
    //   this.routeIdInput.setValue(this.routeId.toString(), options);
    // }
    ///////////////////////

  }

  ngOnInit(): void {
    this.routeId=this.activeRoute.snapshot.params['route_id']
    console.log('Al addLandmark le llego el id: ' + this.routeId)
  }

  onClickOk(){
    this.router.navigate(['../'],{relativeTo:this.route})
  }


}
