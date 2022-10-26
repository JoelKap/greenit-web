import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRepairsComponent } from './view-repairs.component';

describe('ViewChatsComponent', () => {
  let component: ViewRepairsComponent;
  let fixture: ComponentFixture<ViewRepairsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewRepairsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRepairsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
