import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLostDocumentsComponent } from './view-lost-documents.component';

describe('ViewLostDocumentsComponent', () => {
  let component: ViewLostDocumentsComponent;
  let fixture: ComponentFixture<ViewLostDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewLostDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLostDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
