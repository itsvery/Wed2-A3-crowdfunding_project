import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FundraiserComponent } from './fundraiser/fundraiser.component';
import { DonationComponent } from './donation/donation.component';
import { SearchComponent } from './search/search.component';

export const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'fundraiser/:id', component: FundraiserComponent },
  { path: 'donation/:fundraiser_id', component: DonationComponent },
  { path: 'search', component: SearchComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];
