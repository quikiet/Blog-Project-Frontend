import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSubmitDeleteComponent } from './modal-submit-delete.component';

describe('ModalSubmitDeleteComponent', () => {
  let component: ModalSubmitDeleteComponent;
  let fixture: ComponentFixture<ModalSubmitDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalSubmitDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalSubmitDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
