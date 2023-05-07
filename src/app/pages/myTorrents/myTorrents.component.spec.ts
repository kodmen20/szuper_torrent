import { ComponentFixture, TestBed } from '@angular/core/testing';

import { myTorrentsComponent } from './myTorrents.component';

describe('myTorrentsComponent', () => {
  let component: myTorrentsComponent;
  let fixture: ComponentFixture<myTorrentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [myTorrentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(myTorrentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
