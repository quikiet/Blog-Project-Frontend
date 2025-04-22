import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalInfomationComponent } from './personal-infomation.component';

describe('PersonalInfomationComponent', () => {
  let component: PersonalInfomationComponent;
  let fixture: ComponentFixture<PersonalInfomationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalInfomationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalInfomationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
