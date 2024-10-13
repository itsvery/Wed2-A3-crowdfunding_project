import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FundraiserService {

  private apiUrl = 'http://localhost:3000/api';

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
