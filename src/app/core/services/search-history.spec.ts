import { TestBed } from '@angular/core/testing';

import { SearchHistory } from './search-history';

describe('SearchHistory', () => {
  const KEY = 'brwery_search_history';
  let service: SearchHistory;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [SearchHistory],
    });
    service = TestBed.inject(SearchHistory);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    service.items();
  });

  it('should add search term to history', () => {
    service.add('test');
    const history = JSON.parse(localStorage.getItem(KEY) || '[]');
    expect(history[0].label).toEqual('test');
  });

  it('should not add duplicate search term to history', () => {
    service.add('test');
    service.add('test');
    const history = JSON.parse(localStorage.getItem(KEY) || '[]');
    expect(history.length).toEqual(1);
  });

  it('should limit history to 10 items', () => {
    for (let i = 0; i < 12; i++) {
      service.add(`test${i}`);
    }
    const history = JSON.parse(localStorage.getItem(KEY) || '[]');
    expect(history.length).toEqual(10);
    expect(history[0].label).toEqual('test11');
    expect(history[9].label).toEqual('test2');
  });

  it('should clear history', () => {
    service.add('test');
    service.clear();
    const history = JSON.parse(localStorage.getItem(KEY) || '[]');
    expect(history.length).toEqual(0);
  });

  it('should return search history', () => {
    service.add('test1');
    service.add('test2');
    const history = JSON.parse(localStorage.getItem(KEY) || '[]');
    expect(history.length).toEqual(2);
    expect(history[0].label).toEqual('test2');
    expect(history[1].label).toEqual('test1');
  });

  it('should remove specific search term from history', () => {
    service.add('test1');
    service.add('test2');
    const historyBefore = JSON.parse(localStorage.getItem(KEY) || '[]');
    const idToRemove = historyBefore[0].id;
    service.remove(idToRemove);
    const historyAfter = JSON.parse(localStorage.getItem(KEY) || '[]');
    expect(historyAfter.length).toEqual(1);
    expect(historyAfter[0].label).toEqual('test1');
  });

  it('should read from storage on initialization', () => {
    const mockHistory = [
      { id: '1', label: 'test1', createdAt: new Date().toISOString() },
      { id: '2', label: 'test2', createdAt: new Date().toISOString() },
    ];
    localStorage.setItem(KEY, JSON.stringify(mockHistory));
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [SearchHistory],
    });
    const newService = TestBed.inject(SearchHistory);
    expect(newService.items()).toEqual(mockHistory);
  });

  it('should return empty array if storage is corrupted', () => {
    localStorage.setItem(KEY, 'not a valid json');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [SearchHistory],
    });
    const newService = TestBed.inject(SearchHistory);
    expect(newService.items()).toEqual([]);
  });

  it('should hanlde empty labels gracefully', () => {
    service.add('   ');
    const history = JSON.parse(localStorage.getItem(KEY) || '[]');
    expect(history.length).toEqual(0);
  });

  it('should handle parsed data that is not an array', () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ id: '1', label: 'test', createdAt: new Date().toISOString() }),
    );
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [SearchHistory],
    });
    const newService = TestBed.inject(SearchHistory);
    expect(newService.items()).toEqual([]);
  });
});
