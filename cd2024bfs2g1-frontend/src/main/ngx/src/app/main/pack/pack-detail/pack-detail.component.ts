import {AfterViewInit, Component, Inject, Injector, OnInit, ViewChild} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {
  DialogService,
  ODialogConfig,
  OFormComponent,
  OSnackBarConfig,
  OTableComponent,
  OTranslateService,
  OntimizeService,
  SnackBarService, AuthService, OComboComponent, OGridComponent,
  Expression,
  FilterExpressionUtils,
} from "ontimize-web-ngx";
import {PackHomeComponent} from "../pack-home/pack-home.component";
import {UserInfoService} from "../../../shared/services/user-info.service";

@Component({
  selector: "app-pack-detail",
  templateUrl: "./pack-detail.component.html",
  styleUrls: ["./pack-detail.component.css"],
})
export class PackDetailComponent implements OnInit, AfterViewInit {
  @ViewChild("form") formPack: OFormComponent
  @ViewChild("packDatesForm") packDatesForm: OGridComponent
  @ViewChild("packDateCombo") packDateCombo: OComboComponent
  @ViewChild("packDaysCombo") packDaysCombo: OComboComponent
  protected isPackInstance: boolean

  public arrayDias = [];
  public selectedDay;
  public selectedComboDay;

  protected availableDates: Set<any> = new Set // TODO: CHECK IF NEEDED
  protected bussineses: Array<any> // TODO: CHECK IF NEEDED
  protected routes: Array<any> // TODO: CHECK IF NEEDED
  constructor(
    protected sanitizer: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute,
    private oTranslate: OTranslateService,
    private packDateService: OntimizeService,
    protected dialogService: DialogService,
    protected injector: Injector,
    protected bookingService: OntimizeService,
    protected snackBarService: SnackBarService,
    @Inject(AuthService) private authService: AuthService,
    @Inject(UserInfoService) private userInfoService: UserInfoService,
    @Inject(OntimizeService) protected service: OntimizeService
  ) {
    this.bookingService = this.injector.get(OntimizeService);
  }

  ngOnInit(): void {
    this.isPackInstance = false
    this.isInstanceOfPack()
    this.getDays()
  }

  ngAfterViewInit() {
    this.populateDates()
  }

  public getImageSrc(base64: any): any {
    return base64
      ? this.sanitizer.bypassSecurityTrustResourceUrl(
          "data:image/*;base64," + base64
        )
      : "./assets/images/no-image-transparent.png";
  }

  public openPacks(): void {
    if (PackHomeComponent.page == 1 || !PackHomeComponent.page) {
      this.router.navigate(["main/packs"]);
    } else {
      this.router.navigate(["main/pack-client"]);
    }
  }

  diferenciaDias(fechaInicio: number, fechaFin: number): number {
    const unDia = 24 * 60 * 60 * 1000; // Número de milisegundos en un día
    const diferencia = Math.abs(fechaFin - fechaInicio);
    return Math.round(diferencia / unDia);
  }


  getDate(fechaNumber: number): string {
    const tempFecha = new Date(fechaNumber);
    return tempFecha.toLocaleDateString();

  }

  bookPack(data: any) {
    const config: ODialogConfig = {
      icon: "warning",
      alertType: "warn",
    };

    if (this.dialogService) {
      this.dialogService.confirm(
        this.oTranslate.get("BOOKING-DIALOG"),
        this.oTranslate.get("BOOKING-DIALOG-B"),
        config
      );
      this.dialogService.dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.insertBooking(data);
          // Actions on confirmation
        } else {
          // Actions on cancellation
        }
      });
    }
  }
  insertBooking(data) {
    const confBooking = this.bookingService.getDefaultServiceConfiguration("packBookings");
    this.bookingService.configureService(confBooking);
    this.bookingService
      .insert({pd_id: data[0].pd_id, usr_id: this.userInfoService.getUserInfo().usr_id}, "packBooking")
      .subscribe((resp) => {
        //TODO: this.form.reload(true);

        const config: OSnackBarConfig = {
          action: "",
          milliseconds: 2000,
          icon: "booking",
          iconPosition: "left",
          cssClass: "snackbar",
        };
        this.snackBarService.open("BOOKING.CONFIRMED", config);
        this.router.navigate(['../'])
      });
  }

  populateDates() {
    const confPack = this.packDateService.getDefaultServiceConfiguration('packDates');
    this.packDateService.configureService(confPack);

    const id = +this.route.snapshot.params["pck_id"]

    this.packDateService.query(
      {pck_id: id, pcs_id: 1},
      ["pd_id", "pd_date_begin", "pd_date_end"],
      "packDate",
      {
        pd_id: 4,
        pd_date_begin: 93,
        pd_date_end: 93
      })
      .subscribe((result) => {
        if (result.data.length) {
          result.data.forEach((date) => {
            date.pd_date_begin = new Date(date.pd_date_begin).toLocaleDateString()
            date.pd_date_end = new Date(date.pd_date_end).toLocaleDateString()
          })
          this.packDateCombo.setDataArray(result.data)
        }
      });
  }

  isLogged() {
    return this.authService.isLoggedIn()
  }

  private isInstanceOfPack(): void {
    this.packDateService.query({pck_id: +this.route.snapshot.params['pck_id']}, ['pck_id'], 'packDate')
      .subscribe((result) => {
        if (result.data[0] !== undefined){
          this.isPackInstance = true
        }
      });
  }

  //Metodos para redirect dinamico de business
  openDetailBusiness(data: any): void {
    this.router.navigate(['main/businesses/' + data.bsn_id]);
    const currentUrl = this.router.url; // Capturar la URL actual
    const navigationExtras: NavigationExtras = {
      state: { previousUrl: currentUrl } // Enviar la URL actual como navigation state
    };
    this.router.navigate(['main/businesses/' + data.bsn_id], navigationExtras);
  }


  //Metodo para redirect dinamico de rutas
  openDetailRoutes(data: any): void {
    this.router.navigate(['main/routes/' + data.route_id]);
    const currentUrl = this.router.url; // Capturar la URL actual
    const navigationExtras: NavigationExtras = {
      state: { previousUrl: currentUrl } // Enviar la URL actual como navigation state
    };
    this.router.navigate(['main/routes/' + data.route_id], navigationExtras);
  }



  public getRouteImageSrc(base64: any): any {
    return base64 ? this.sanitizer.bypassSecurityTrustResourceUrl("data:image/*;base64," + base64) : "./assets/images/logo-walking.png";
  }

  getDifficultad(difficulty: number): string {
    switch(difficulty) {
      case 1:
        return 'Fácil';
      case 2:
        return 'Intermedio';
      case 3:
        return 'Difícil';
      case 4:
        return 'Extremo';
    }
  }

    //FILTROS
    @ViewChild("daySelectorForm") protected daySelectorForm: OFormComponent;
    createFilter(values: Array<{ attr: string, value: any }>): Expression {
      let filters: Array<Expression> = [];

      values.forEach(fil => {
        if (fil.value) {
          if (fil.attr === 'assigned_date') {
            let value: number = Number(fil.value);
            filters.push(FilterExpressionUtils.buildExpressionEquals("assigned_date", value));
          }
        }
      });

      if (filters.length > 0) {
        return filters.reduce((exp1, exp2) =>
          FilterExpressionUtils.buildComplexExpression(exp1, exp2, FilterExpressionUtils.OP_AND)
        );
      } else {
        return null;
      }
    }

    public array: Object[] = [{
      key: 1,
      value: '1'
    }, {
      key: 2,
      value: '2'
    }, {
      key: 3,
      value: '3'
    }, {
      key: 4,
      value: '4'
    }];

    getDays() {
      const filter = {
        pck_id: this.route.snapshot.params["pck_id"],
      };
      const confPack = this.packDateService.getDefaultServiceConfiguration('packs');
      this.packDateService.configureService(confPack);
      const columns = ["pck_name", "pck_days"];
      this.service.query(filter, columns, "packDays").subscribe((resp) => {
        if (resp.code === 0) {
          // resp.data contains the data retrieved from the server

          const array = resp.data;
          const data = array[0];
          const days = data["pck_days"];

          for (let d of days) {
            this.arrayDias.push({ day: d["day"], day_string: d["day_string"] });
          }

          this.selectedComboDay;
        } else {
          alert("Impossible to query data!");
        }
      });
    }


    returnArray(): any[] {
      return this.array;
    }

    @ViewChild('gridBusinessesOfPack', { static: true }) gridBusinessesOfPack: any;
    @ViewChild('gridRoutesOfPack', { static: true }) gridRoutesOfPack: any;

    applyFilter(value: any): void {
      const filter = { assigned_date: value };

      this.gridBusinessesOfPack.queryData(filter);
      this.gridRoutesOfPack.queryData(filter);
    }
}
