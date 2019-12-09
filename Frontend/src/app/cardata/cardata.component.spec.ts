import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarDataComponent } from './cardata.component';

describe('CarDataComponent', () => {
  let component: CarDataComponent;
  let fixture: ComponentFixture<CarDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
