import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestionsList } from './suggestions-list';
import { Brewery } from '../../../core/models/brewery.model';
import { By } from '@angular/platform-browser';

describe('SuggestionsList', () => {
  let component: SuggestionsList;
  let fixture: ComponentFixture<SuggestionsList>;

  const mockSuggestions: Brewery[] = [
    { id: '1', name: 'Suggestion 1', city: 'City 1', state_province: 'State 1', country: 'USA' },
    { id: '2', name: 'Suggestion 2', city: 'City 2', state_province: 'State 2', country: 'Canada' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuggestionsList],
    }).compileComponents();

    fixture = TestBed.createComponent(SuggestionsList);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('items', mockSuggestions);
    fixture.componentRef.setInput('showAll', true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the correct number of suggestions', () => {
    const suggestionElements = fixture.debugElement.queryAll(By.css('button.row'));

    expect(suggestionElements.length).toBe(mockSuggestions.length);
  });

  it('emits seeAll event when "See all results" button is clicked', () => {
    const spy = vi.fn();
    fixture.componentInstance.seeAll.subscribe(spy);
    const seeAllButton = fixture.debugElement.query(By.css('button.see-all'));
    seeAllButton.triggerEventHandler('click', null);

    expect(spy).toHaveBeenCalled();
  });

  it('emits selectItem event when a suggestion is clicked', () => {
    const spy = vi.fn();
    fixture.componentInstance.selectItem.subscribe(spy);
    const suggestionButtons = fixture.debugElement.queryAll(By.css('button.row'));
    suggestionButtons[0].triggerEventHandler('click', null);
    
    expect(spy).toHaveBeenCalledWith(mockSuggestions[0]);
  });
});
