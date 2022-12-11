import { Component, Input } from "@angular/core";
import { CarouselContents } from "../shared/carousel-contents.model";

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent {
  @Input() contents: CarouselContents[] = [
    {"image_url": "/assets/apl_golf_logo.png", "image_position": "left", "title": "Title Here", "description": "Lorem ipsum..."},
    {"image_url": "/assets/trophy.png", "title": "Title Here", "description": "Lorem ipsum..."},
    {"image_url": "/assets/courses/Greystone/logo.png", "image_position": "right", "title": "Title Here", "description": "Lorem ipsum..."}
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

  getCurrentTextClass(): string {
    if (this.contents[this.currentIndex].image_position) {
      switch (this.contents[this.currentIndex].image_position) {
        case 'left':
          return 'text-right';
        case 'right':
          return 'text-left';
      }
    }
    return 'text-center';
  }

  getCurrentTitle(): string | undefined {
    return this.contents[this.currentIndex].title;
  }

  getCurrentDescription(): string | undefined {
    return this.contents[this.currentIndex].description;
  }

}
