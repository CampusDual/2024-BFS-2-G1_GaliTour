import { Component, Injector, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService, DialogService, ODialogConfig, OFormComponent, OSnackBarConfig, OTableComponent, OTranslateModule, OTranslateService, OntimizeService, SnackBarService } from 'ontimize-web-ngx';
import { PackHomeComponent } from '../pack-home/pack-home.component';

@Component({
  selector: 'app-pack-detail',
  templateUrl: './pack-detail.component.html',
  styleUrls: ['./pack-detail.component.css']
})
export class PackDetailComponent {
  @ViewChild('accountCustomerTable') accountTable: OTableComponent;
  @ViewChild('form') form: OFormComponent;

  constructor(
    protected sanitizer: DomSanitizer,
    private router: Router,
    private oTranslate: OTranslateService,
    protected dialogService: DialogService,
    protected injector: Injector,
    protected service: OntimizeService,
    protected snackBarService: SnackBarService,
    private authService: AuthService
  ) {
    this.service = this.injector.get(OntimizeService);
  }

  id: string = "";

	ngOnInit(): void {
    this.configureService();
    let sessionData = localStorage.getItem("com.ontimize.web.ngx.jee.seed");
    this.id = JSON.parse(sessionData).session["usr_id"];
  }

  public getImageSrc(base64: any): any {
    return base64 ? this.sanitizer.bypassSecurityTrustResourceUrl('data:image/*;base64,' + base64) : './assets/images/no-image-transparent.png';
  }

  public openPacks(): void {
    if(PackHomeComponent.page==1){
      this.router.navigate(['main/packs']);
    }else{
      this.router.navigate(['main/pack-client']);
    }
  }

  diferenciaDias(fechaInicio: number, fechaFin: number): number {
    const unDia = 24 * 60 * 60 * 1000; // Número de milisegundos en un día
    const diferencia = Math.abs(fechaFin - fechaInicio);
    return Math.round(diferencia / unDia);
  }


  getDate (fechaNumber: number): string {
    const tempFecha = new Date(fechaNumber)
    const day = tempFecha.getDay()
    const month = tempFecha.getMonth()
    const year = tempFecha.getFullYear()
    return `${day}/${month}/${year}`;
  }

  bookPack(event: any, data) {

    const config: ODialogConfig = {
      icon: 'warning',
      alertType: 'warn',

    };
    
    if (this.dialogService) {
      this.dialogService.confirm(this.oTranslate.get('BOOKING-DIALOG'), this.oTranslate.get('BOOKING-DIALOG-B'), config);
      this.dialogService.dialogRef.afterClosed().subscribe( result => {
        if(result) {
          this.insertBooking(data);
          // Actions on confirmation
        } else {
          // Actions on cancellation
        }
      })
    }


  }

  protected configureService() {
    // Configure the service using the configuration defined in the `app.services.config.ts` file
    const conf = this.service.getDefaultServiceConfiguration('packBookings');
    this.service.configureService(conf);
  }

  
    insertBooking(data) {

   
      this.service.insert({ "pck_id": data.pck_id }, "packBooking")
      .subscribe(resp => {
        this.form.reload(true);
        if(resp != null){
          const config: OSnackBarConfig = {
            action: "",
            milliseconds: 2000,
            icon: 'booking',
            iconPosition: 'left',
            cssClass: "snackbar"
          };
          this.snackBarService.open("BOOKING.CONFIRMED", config);
        }
       else {
        const config: OSnackBarConfig = {
          action: "",
          milliseconds: 2000,
          icon: 'booking',
          iconPosition: 'left',
          cssClass: "snackbar"
        };
        this.snackBarService.open("falsdas", config);
       }
      });
      }

   


}
