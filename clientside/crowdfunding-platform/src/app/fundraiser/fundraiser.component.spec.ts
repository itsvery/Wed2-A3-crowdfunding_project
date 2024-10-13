import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundraiserComponent } from './fundraiser.component';

describe('FundraiserComponent', () => {
  let component: FundraiserComponent;
  let fixture: ComponentFixture<FundraiserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FundraiserComponent]
    });
    fixture = TestBed.createComponent(FundraiserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
