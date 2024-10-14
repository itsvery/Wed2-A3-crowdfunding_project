import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FundraiserService {

  private apiUrl = 'http://24274834.it.scu.edu.au/DataServ';

  constructor(private http: HttpClient) { }

  getFundraisers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/fundraisers`);
  }

  getFundraiser(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/fundraiser/${id}`);
  }

  searchFundraisers(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search${query}`);
  }

  submitDonation(donationData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/donations`, donationData);
  }
}
