import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FundraiserService } from '../fundraiser.service';

@Component({
  selector: 'app-donation',
  templateUrl: './donation.component.html',
  styleUrls: ['./donation.component.css']
})
export class DonationComponent implements OnInit {

  giver: string = '';
  amount: number = 0;
  fundraiser: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fundraiserService: FundraiserService
  ) { }

  ngOnInit(): void {
    const fundraiserId = this.route.snapshot.paramMap.get('fundraiser_id');
    if (fundraiserId) {
      this.fundraiserService.getFundraiser(fundraiserId).subscribe(
        data => this.fundraiser = data,
        error => console.error('Error fetching fundraiser details:', error)
      );
    }
  }

  submitDonation(): void {
    if (this.amount < 5) {
      alert('The minimum donation amount is 5 AUD.');
      return;
    }

    const donationData = {
      DATE: new Date().toISOString(),
      AMOUNT: this.amount,
      GIVER: this.giver,
      FUNDRAISER_ID: this.fundraiser.FUNDRAISER_ID
    };

    this.fundraiserService.submitDonation(donationData).subscribe(
      response => {
        alert(`Thank you for your donation to ${response.message}`);
        this.router.navigate(['/fundraiser', this.fundraiser.FUNDRAISER_ID]);
      },
      error => console.error('Error submitting donation:', error)
    );
  }
}
