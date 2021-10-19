import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFoundDocumentsComponent } from './view-found-documents.component';

describe('ViewFoundDocumentsComponent', () => {
  let component: ViewFoundDocumentsComponent;
  let fixture: ComponentFixture<ViewFoundDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFoundDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFoundDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
