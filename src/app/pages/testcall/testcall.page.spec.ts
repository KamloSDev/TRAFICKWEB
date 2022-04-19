import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TestcallPage } from './testcall.page';

describe('TestcallPage', () => {
  let component: TestcallPage;
  let fixture: ComponentFixture<TestcallPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestcallPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TestcallPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
