import { AfterViewInit, Component, OnInit } from "@angular/core";
import {
  Expression,
  FilterExpressionUtils,
  OntimizeService,
  Util,
} from "ontimize-web-ngx";
import { Landmark } from "./landmark-model";
import { RouteService } from "src/app/shared/services/route.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-view-all-landmark",
  templateUrl: "./view-all-landmark.component.html",
  styleUrls: ["./view-all-landmark.component.css"],
})
export class ViewAllLandmarkComponent implements AfterViewInit {
  datosTabla: Landmark[] = [];
  idRutaActual: number;

  constructor(
    private ontimizelandmarkService: OntimizeService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    this.configureService();
  }

  ngAfterViewInit(): void {
    this.idRutaActual = +this.getRouteId();
    this.consultarDatosPorId(this.idRutaActual);
    console.log("El id de mi ruta es :", +this.idRutaActual);
  }

  protected configureService() {
    const conf =
      this.ontimizelandmarkService.getDefaultServiceConfiguration("landmarks");
    this.ontimizelandmarkService.configureService(conf);
  }

  onClickBackToRoutes() {
    this.router.navigate(["main", "routes"]);
  }

  getRouteId(): number {
    return +this.activeRoute.snapshot.params["route_id"];
  }

  consultarDatosPorId(id: any): void {
    this.ontimizelandmarkService
      .query(
        { route_id: id },
        ["l.landmark_id", "l.name", "l.coordinates"],
        "landmark"
      )
      .subscribe((response) => {
        this.datosTabla.push(...response.data);
        console.log(this.datosTabla);
      });
  }

  createFilter(values: Array<{ attr; value }>): Expression {
    let filters: Array<Expression> = [];
    values.forEach((fil) => {
      if (Util.isDefined(fil.value)) {
        if (
          fil.attr === "name" ||
          fil.attr === "description" ||
          fil.attr === "opening_time" ||
          fil.attr === "closing_time" ||
          fil.attr === "coordinates"
        ) {
          filters.push(
            FilterExpressionUtils.buildExpressionLike(
              "name" + fil.attr,
              fil.value
            )
          );
        }
      }
    });

    if (filters.length > 0) {
      return filters.reduce((exp1, exp2) =>
        FilterExpressionUtils.buildComplexExpression(
          exp1,
          exp2,
          FilterExpressionUtils.OP_AND
        )
      );
    } else {
      return null;
    }
  }

  
}
