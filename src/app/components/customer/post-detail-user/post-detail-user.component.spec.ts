import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDetailUserComponent } from './post-detail-user.component';

describe('PostDetailUserComponent', () => {
  let component: PostDetailUserComponent;
  let fixture: ComponentFixture<PostDetailUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostDetailUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostDetailUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
