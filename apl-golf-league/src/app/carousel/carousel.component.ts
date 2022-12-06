import { Component, Input } from "@angular/core";
import { CarouselContents } from "../shared/carousel-contents.model";

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent {
  @Input() contents: CarouselContents[] = [];

  currentIndex: number = 0;

}
