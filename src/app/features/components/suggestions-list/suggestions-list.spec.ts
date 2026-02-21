import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestionsList } from './suggestions-list';

describe('SuggestionsList', () => {
  let component: SuggestionsList;
  let fixture: ComponentFixture<SuggestionsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuggestionsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuggestionsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
