import { Component, Input } from "@angular/core";
import { CarouselContents } from "../shared/carousel-contents.model";

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent {
  @Input() contents: CarouselContents[] = [
    {"image_url": "/assets/apl_golf_logo.png", "image_position": "left"},
    {"image_url": "/assets/trophy.png"},
    {"image_url": "/assets/courses/Greystone/logo.png", "image_position": "right"}
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

  getCurrentImageUrl(): string {
    return `url(${this.contents[this.currentIndex].image_url})`
  }

  getCurrentImagePosition(): string {
    if (this.contents[this.currentIndex].image_position) {
      return `${this.contents[this.currentIndex].image_position}`;
    }
    return 'center';
  }
}
