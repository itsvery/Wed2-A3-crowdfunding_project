import { Component } from '@angular/core';
import { FundraiserService } from '../fundraiser.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  organizer: string = '';
  city: string = '';
  category: string = '';
  searchResults: any[] = [];

  constructor(private fundraiserService: FundraiserService) { }

  searchFundraisers(): void {
    let query = '?';
    if (this.organizer) query += `organizer=${this.organizer}&`;
    if (this.city) query += `city=${this.city}&`;
    if (this.category) query += `category=${this.category}&`;

    this.fundraiserService.searchFundraisers(query).subscribe(
      data => this.searchResults = data,
      error => console.error('Error searching fundraisers:', error)
    );
  }

  clearSearch(): void {
    this.organizer = '';
    this.city = '';
    this.category = '';
    this.searchResults = [];
  }
}
