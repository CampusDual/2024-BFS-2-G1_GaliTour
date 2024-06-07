import {Component, Inject, Renderer2, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {OntimizeService, OSnackBarConfig, OTextareaInputComponent} from "ontimize-web-ngx";
import {UserInfoService} from "../../../shared/services/user-info.service";

@Component({
  selector: 'app-pack-valoration',
  templateUrl: './pack-valoration.component.html',
  styleUrls: ['./pack-valoration.component.css']
})
export class PackValorationComponent {
  @ViewChild('star2') star2: MatIcon;
  @ViewChild('star3') star3: MatIcon;
  @ViewChild('star4') star4: MatIcon;
  @ViewChild('star5') star5: MatIcon;
  @ViewChild('comment') comment: OTextareaInputComponent

  stars: number;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private renderer: Renderer2,
    private router: Router,
    protected sanitizer: DomSanitizer,
    private actRoute: ActivatedRoute,
    private dialogRef: MatDialogRef<PackValorationComponent>,
    @Inject(OntimizeService) protected ratingService: OntimizeService,
    @Inject(UserInfoService) private userInfoService: UserInfoService,
  ) {
    this.stars = data.stars
    console.log(data)
  }


  valorateSelect(stars: number): void {
    this.star2._elementRef.nativeElement.classList.remove('star_color')
    this.star3._elementRef.nativeElement.classList.remove('star_color')
    this.star4._elementRef.nativeElement.classList.remove('star_color')
    this.star5._elementRef.nativeElement.classList.remove('star_color')
    switch (stars) {
      case 5:
        this.star5._elementRef.nativeElement.classList.add('star_color')
      case 4:
        this.star4._elementRef.nativeElement.classList.add('star_color')
      case 3:
        this.star3._elementRef.nativeElement.classList.add('star_color')
      case 2:
        this.star2._elementRef.nativeElement.classList.add('star_color')
    }
    this.stars = stars
  }

  insertRating() {
    const confRatingService = this.ratingService.getDefaultServiceConfiguration("packRatings");
    this.ratingService.configureService(confRatingService);
    this.ratingService.insert(
      {
        pck_id: this.data.data.pck_id,
        pd_id: this.data.data.pd_id,
        usr_id: this.userInfoService.getUserInfo().usr_id,
        pcr_stars: this.stars,
        pcr_comment: this.comment.getValue()
      },
      "packBooking")
      .subscribe((resp) => {

        const config: OSnackBarConfig = {
          action: "",
          milliseconds: 2000,
          icon: "booking",
          iconPosition: "left",
          cssClass: "snackbar",
        };
        // this.snackBarService.open("BOOKING.CONFIRMED", config);
        this.router.navigate(["..", "main", "pack-client"])
      });
    this.dialogRef.close();
  }

  public getImageSrc(base64: any): any {
    return base64 ? this.sanitizer.bypassSecurityTrustResourceUrl('data:image/*;base64,' + base64) : './assets/images/no-image-transparent.png';
  }


}
