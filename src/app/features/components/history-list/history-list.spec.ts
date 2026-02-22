import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryList } from './history-list';
import { SearchHistoryItem } from '../../../core/models/search-history-item';
import { dateIso } from '../../../core/utils/datetime.util';

describe('HistoryList', () => {
  let component: HistoryList;
  let fixture: ComponentFixture<HistoryList>;

  const mockHistory: SearchHistoryItem[] = [
    {
      id: '1',
      label: 'Test Brewery 1',
      createdAt: dateIso(),
    },
    {
      id: '2',
      label: 'Test Brewery 2',
      createdAt: dateIso(),
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryList],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryList);
    fixture.componentRef.setInput('items', mockHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders history items', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const items = compiled.querySelectorAll('li');
    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain('Test Brewery 1');
    expect(items[1].textContent).toContain('Test Brewery 2');
  });

  it('emits remove event when delete button is clicked', () => {
    const spy = vi.fn();
    fixture.componentInstance.removeItem.subscribe(spy);
    const compiled = fixture.nativeElement as HTMLElement;
    const deleteButtons = compiled.querySelectorAll('button');
    deleteButtons[0].click();
    expect(spy).toHaveBeenCalledWith('1');
  });
});
