import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRecyclesComponent } from './view-recycles.component';

describe('ViewFoundDocumentsComponent', () => {
  let component: ViewRecyclesComponent;
  let fixture: ComponentFixture<ViewRecyclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewRecyclesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRecyclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
