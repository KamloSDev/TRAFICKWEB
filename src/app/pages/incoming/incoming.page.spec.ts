import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IncomingPage } from './incoming.page';

describe('IncomingPage', () => {
  let component: IncomingPage;
  let fixture: ComponentFixture<IncomingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IncomingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
