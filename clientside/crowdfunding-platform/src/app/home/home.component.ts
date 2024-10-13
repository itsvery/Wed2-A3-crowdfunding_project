import { Component, OnInit } from '@angular/core';
import { FundraiserService } from '../fundraiser.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  fundraisers: any[] = [];

  constructor(private fundraiserService: FundraiserService) { }

  ngOnInit(): void {
    this.fundraiserService.getFundraisers().subscribe(
      data => this.fundraisers = data,
      error => console.error('Error fetching fundraisers:', error)
    );
  }
}
