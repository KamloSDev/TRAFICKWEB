import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddStructurePage } from './add-structure.page';

describe('AddStructurePage', () => {
  let component: AddStructurePage;
  let fixture: ComponentFixture<AddStructurePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStructurePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddStructurePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
