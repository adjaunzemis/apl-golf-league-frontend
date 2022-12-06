import { Component, Input } from "@angular/core";
import { CarouselContents } from "../shared/carousel-contents.model";

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent {
  @Input() contents: CarouselContents[] = [
    {"background_image_url": "/assets/apl_golf_logo.png"},
    {"background_image_url": "/assets/trophy.png"}
  ];

  currentIndex: number = 0;

  goToNext(): void {
    this.currentIndex += 1;
    if (this.currentIndex >= this.contents.length) {
      this.currentIndex = 0;
    }
  }

  goToPrevious(): void {
    this.currentIndex -= 1;
    if (this.currentIndex < 0) {
      this.currentIndex = this.contents.length - 1;
    }
  }

  goToIndex(idx: number): void {
    this.currentIndex = idx;
  }

  getCurrentBackgroundImageUrl(): string {
    return `${this.contents[this.currentIndex].background_image_url}`
  }

}
