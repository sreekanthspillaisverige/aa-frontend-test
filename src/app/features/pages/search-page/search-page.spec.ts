import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchPage } from './search-page';
import { BreweryApi } from '../../../core/services/brewery-api';
import { SearchHistory } from '../../../core/services/search-history';
import { of, throwError } from 'rxjs';
import { SEARCH_DEBOUNCE_MS } from '../../../core/utils/search-page.tokens';
import { Brewery } from '../../../core/models/brewery.model';
import { By } from '@angular/platform-browser';
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';
import { SearchHistoryItem } from '../../../core/models/search-history-item';
import { signal } from '@angular/core';

describe('SearchPage', () => {
  let fixture: ComponentFixture<SearchPage>;
  let component: SearchPage;
  let apiCalls: Array<[string, number]> = [];
  let lastHistoryAdded: string | null = null;
  let lastHistoryRemoved: string | null = null;
  const historyItemsSig = signal<SearchHistoryItem[]>([]);
  const apiResultsSig = signal<Brewery[] | null>(null);
  const apiShouldErrorSig = signal(false);

  const apiMock: Pick<BreweryApi, 'searchBreweries'> = {
    searchBreweries: (q: string, per: number) => {
      apiCalls.push([q, per]);
      if (apiShouldErrorSig()) return throwError(() => new Error('API error'));
      return of(apiResultsSig() ?? []);
    },
  };

  const mockBrewery = (id: string, name: string): Brewery => ({
    id: id,
    name: name,
    city: 'Test City',
    address_1: '123 Test St',
    state_province: 'Test State',
    country: 'Test Country',
    brewery_type: 'micro',
    website_url: 'http://testbrewery.com',
  });

  async function flushChanges() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  async function flushRx() {
    await vi.runAllTimersAsync();
    await flushChanges();
  }

  async function typeQuery(value: string) {
    component.queryCtrl.setValue(value);
    await flushRx();
  }

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  beforeEach(async () => {
    historyItemsSig.set([]);
    apiCalls = [];
    lastHistoryAdded = null;
    lastHistoryRemoved = null;
    await TestBed.configureTestingModule({
      imports: [SearchPage],
      providers: [
        { provide: SEARCH_DEBOUNCE_MS, useValue: 0 },
        { provide: BreweryApi, useValue: apiMock },
        {
          provide: SearchHistory,
          useValue: {
            items: () => historyItemsSig(),
            add: (label: string) => {
              lastHistoryAdded = label;
            },
            remove: (id: string) => {
              lastHistoryRemoved = id;
              historyItemsSig.set(historyItemsSig().filter((x) => x.id !== id));
            },
            clear: () => {},
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await flushChanges();
    vi.useFakeTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders min-length hint when query is less than 3 characters', async () => {
    await typeQuery('ab');

    const hintElement = fixture.debugElement.query(By.css('.hint'));
    
    expect(hintElement).not.toBeNull();
  });

  it('does not call API when query is less than 3 characters', async () => {
    await typeQuery('ab');

    expect(apiCalls.length).toBe(0);
    expect(component.uiState()).toBe('idle');
    expect(component.suggestions()).toEqual([]);
  });

  it('calls API and updates suggestions when query is 3 or more characters', async () => {
    await typeQuery('abc');

    expect(apiCalls.length).toBe(1);
    expect(apiCalls[0][0]).toBe('abc');
    expect(apiCalls[0][1]).toBe(5);
    expect(component.uiState()).toBe('ready');
    expect(component.suggestions()).toEqual([]);
  });

  it('clicking clear in input box calls clear', async () => {
    const searchInput = fixture.debugElement.query(By.css('app-search-input'));
    searchInput.triggerEventHandler('clear', null);
    await flushChanges();

    expect(component.query()).toBe('');
  });

  it('clicking close in detail view card clear selection', async () => {
    component.selected.set(mockBrewery('1', 'Test Brewery'));
    await flushChanges();

    const detail = fixture.debugElement.query(By.css('app-detail-view'));
    detail.triggerEventHandler('close', null);
    await flushChanges();

    expect(component.selected()).toBeNull();
  });

  it('clear resets the search state', async () => {
    component.queryCtrl.setValue('test');
    component.selected.set(mockBrewery('1', 'Test Brewery'));
    component.showAll.set(true);
    component.errorMsg.set('Error');
    component.uiState.set('loading');
    component.clear();

    expect(component.query()).toBe('');
    expect(component.selected()).toBeNull();
    expect(component.showAll()).toBe(false);
    expect(component.errorMsg()).toBeNull();
    expect(component.uiState()).toBe('idle');
  });

  it('selectItem sets selected brewery and adds to history', async () => {
    component.showAll.set(true);
    const brewery = mockBrewery('1', 'Test Brewery');
    component.selectItem(brewery);

    expect(component.selected()).toEqual(brewery);
    expect(lastHistoryAdded).toBe('Test Brewery');
  });

  it('showDropdown becomes true when state is ready,  suggestions are available, no selection and query is meaningful', async () => {
    apiResultsSig.set([mockBrewery('1', 'Test Brewery')]);
    await typeQuery('abcd');

    expect(component.uiState()).toBe('ready');
    expect(component.suggestions()).toEqual([mockBrewery('1', 'Test Brewery')]);
    expect(component.showDropdown()).toBe(true);
  });

  it('seeallresults triggers API call with perPage=10', async () => {
    await typeQuery('abcde');
    expect(apiCalls[apiCalls.length - 1]).toEqual(['abcde', 5]);
    component.seeAllResults();
    await flushRx();

    expect(apiCalls.length).toBe(2);
    expect(apiCalls[1][0]).toBe('abcde');
    expect(apiCalls[1][1]).toBe(10);
  });

  it('seeAllResults set showall to true', async () => {
    fixture.componentInstance.seeAllResults();
    await flushChanges();

    expect(fixture.componentInstance.showAll()).toBe(true);
  });

  it('renders error state when errorMsg is set', async () => {
    component.uiState.set('error');
    component.errorMsg.set('Failed to fetch suggestions. Please try again later.');
    await flushChanges();

    const errorElement = fixture.debugElement.query(By.css('.error-state'));
    expect(errorElement).not.toBeNull();
  });

  it('does not render error-state elements when errorMsg is null', async () => {
    component.errorMsg.set(null);
    await flushChanges();

    const errorElement = fixture.debugElement.query(By.css('.error-state'));

    expect(errorElement).toBeNull();
  });

  it('renders error state when API call fails', async () => {
    apiShouldErrorSig.set(true);
    await typeQuery('abcd');

    const errorElement = fixture.debugElement.query(By.css('.error-state'));

    expect(component.uiState()).toBe('error');
    expect(errorElement).not.toBeNull();
  });

  it('renders detail view when a brewery is selected', async () => {
    const brewery = mockBrewery('1', 'Test Brewery');
    component.selected.set(brewery);
    await flushChanges();

    const detailView = fixture.debugElement.query(By.css('app-detail-view'));

    expect(detailView).not.toBeNull();
  });

  it('closeDetailView clears selected brewery', async () => {
    fixture.componentInstance.selected.set(mockBrewery('1', 'Test Brewery'));
    fixture.componentInstance.closeDetailView();
    await flushChanges();

    expect(fixture.componentInstance.selected()).toBeNull();
  });

  it('renders history list when there are history items', async () => {
    historyItemsSig.set([{ id: '1', label: 'test', createdAt: new Date().toISOString() }]);
    await flushChanges();

    const historyList = fixture.debugElement.query(By.css('app-history-list'));
    const text = (historyList.nativeElement as HTMLElement).textContent ?? '';

    expect(historyList).not.toBeNull();
    expect(text).toContain('test');
  });

  it('removeItem output removes history item', async () => {
    historyItemsSig.set([{ id: '1', label: 'test2', createdAt: new Date().toISOString() }]);
    await flushChanges();

    const historyList = fixture.debugElement.query(By.css('app-history-list'));

    expect(historyList).not.toBeNull();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('test2');

    historyList.triggerEventHandler('removeItem', '1');
    await flushChanges();

    expect(lastHistoryRemoved).toBe('1');
    expect(fixture.nativeElement.textContent).not.toContain('test2');
    expect(fixture.debugElement.query(By.css('app-history-list'))).toBeNull();
  });

  it('uses default SEARCH_DEBOUNCE_MS token factory value when not overridden', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const debounce = TestBed.inject(SEARCH_DEBOUNCE_MS);

    expect(debounce).toBe(300);
  });
});
