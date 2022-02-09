import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastBorrowsComponent } from './past-borrows.component';

describe('PastBorrowsComponent', () => {
  let component: PastBorrowsComponent;
  let fixture: ComponentFixture<PastBorrowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PastBorrowsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PastBorrowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
