import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FundraiserService } from '../fundraiser.service';

@Component({
  selector: 'app-fundraiser',
  templateUrl: './fundraiser.component.html',
  styleUrls: ['./fundraiser.component.css']
})
export class FundraiserComponent implements OnInit {

  fundraiser: any;

  constructor(
    private route: ActivatedRoute,
    private fundraiserService: FundraiserService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fundraiserService.getFundraiser(id).subscribe({
        next: data => this.fundraiser = data,
        error: error => console.error('Error fetching fundraiser details:', error)
      });
    }
  }
}
