import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JhoomComponent } from './jhoom.component';

describe('JhoomComponent', () => {
  let component: JhoomComponent;
  let fixture: ComponentFixture<JhoomComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JhoomComponent]
    });
    fixture = TestBed.createComponent(JhoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
