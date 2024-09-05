import { Component, OnInit } from '@angular/core';
import { ImageService } from '../services/service.service'; // Adjust the path as necessary

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  images: { url: string, text: string, date: string }[] = [];
  filteredImages: { url: string, text: string, date: string }[] = [];
  years: number[] = [];
  months: string[] = [];
  days: string[] = [];

  selectedYear: number | null = null;
  selectedMonth: number | null = null;
  selectedDay: number | null = null;

  constructor(private imageService: ImageService) {}

  ngOnInit(): void {
    this.imageService.getImages().subscribe(data => {
      this.images = data;
      this.initializeFilters();
      this.applyFilters();
    });
  }

  initializeFilters(): void {
    const uniqueYears = Array.from(new Set(this.images.map(image => new Date(image.date).getFullYear())));
    this.years = uniqueYears.sort((a, b) => b - a);

    this.months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    this.days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  }

  onYearChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedYear = parseInt(select.value, 10);
    this.applyFilters();
  }

  onMonthChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedMonth = this.months.indexOf(select.value) + 1;
    this.applyFilters();
  }

  onDayChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedDay = parseInt(select.value, 10);
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredImages = this.images.filter(image => {
      const date = new Date(image.date);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      return (!this.selectedYear || this.selectedYear === year) &&
             (!this.selectedMonth || this.selectedMonth === month) &&
             (!this.selectedDay || this.selectedDay === day);
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
}
