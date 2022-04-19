import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StructuresPage } from './structures.page';

describe('StructuresPage', () => {
  let component: StructuresPage;
  let fixture: ComponentFixture<StructuresPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StructuresPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StructuresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
