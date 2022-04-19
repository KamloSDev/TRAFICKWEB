import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CarnetPage } from './carnet.page';

describe('CarnetPage', () => {
  let component: CarnetPage;
  let fixture: ComponentFixture<CarnetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarnetPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CarnetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
