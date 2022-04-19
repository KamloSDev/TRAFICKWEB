import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SpecialitesPage } from './specialites.page';

describe('SpecialitesPage', () => {
  let component: SpecialitesPage;
  let fixture: ComponentFixture<SpecialitesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialitesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SpecialitesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
