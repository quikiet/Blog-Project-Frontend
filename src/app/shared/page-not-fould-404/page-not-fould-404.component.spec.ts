import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNotFould404Component } from './page-not-fould-404.component';

describe('PageNotFould404Component', () => {
  let component: PageNotFould404Component;
  let fixture: ComponentFixture<PageNotFould404Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageNotFould404Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageNotFould404Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
