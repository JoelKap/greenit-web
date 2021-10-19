import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewChatsComponent } from './view-chats.component';

describe('ViewChatsComponent', () => {
  let component: ViewChatsComponent;
  let fixture: ComponentFixture<ViewChatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewChatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewChatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
