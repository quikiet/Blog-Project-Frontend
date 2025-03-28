import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefuseReasonsComponent } from './refuse-reasons.component';

describe('RefuseReasonsComponent', () => {
  let component: RefuseReasonsComponent;
  let fixture: ComponentFixture<RefuseReasonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefuseReasonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefuseReasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
