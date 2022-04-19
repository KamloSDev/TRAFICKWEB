import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecouvrementPage } from './recouvrement.page';

describe('RecouvrementPage', () => {
  let component: RecouvrementPage;
  let fixture: ComponentFixture<RecouvrementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecouvrementPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RecouvrementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
