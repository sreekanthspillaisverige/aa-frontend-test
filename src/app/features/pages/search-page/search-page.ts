import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { SuggestionsList } from '../../components/suggestions-list/suggestions-list';
import { SearchInput } from '../../components/search-input/search-input';
import { DetailView } from '../../components/detail-view/detail-view';
import { HistoryList } from '../../components/history-list/history-list';
import { Brewery } from '../../../core/models/brewery.model';
import { BreweryApi } from '../../../core/services/brewery-api';
import { SearchHistory } from '../../../core/services/search-history';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { isMeaningfulQuery, normalizeQuery } from '../../../core/utils/string.util';

type UiState = 'idle' | 'loading' | 'ready' | 'error';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [ReactiveFormsModule, SearchInput, SuggestionsList, DetailView, HistoryList],
  templateUrl: './search-page.html',
  styleUrl: './search-page.scss',
})
export class SearchPage {
  private readonly api = inject(BreweryApi);
  private readonly history = inject(SearchHistory);
  readonly historyitems = this.history.items;

  readonly queryCtrl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.maxLength(120), Validators.minLength(3)],
  });

  readonly uiState = signal<UiState>('idle');
  readonly errorMsg = signal<string | null>(null);
  readonly showAll = signal(false);
  readonly selected = signal<Brewery | null>(null);

  private readonly query$ = this.queryCtrl.valueChanges.pipe(
    startWith(this.queryCtrl.value),
    map((value) => normalizeQuery(value ?? '')),
    debounceTime(300),
    distinctUntilChanged(),
    tap(() => {
      this.selected.set(null);
      this.errorMsg.set(null);
      this.showAll.set(false);
    }),
  );
  readonly query = toSignal(this.query$, { initialValue: '' });
  private readonly limit = computed(() => (this.showAll() ? 10 : 5));
  private readonly limit$ = toObservable(this.limit);

  readonly suggestions = toSignal(
    combineLatest([this.query$, this.limit$]).pipe(
      switchMap(([query, perPage]) => {
        if (!isMeaningfulQuery(query, 3)) {
          this.uiState.set('idle');
          return of<Brewery[]>([]);
        }
        this.uiState.set('loading');
        return this.api.searchBreweries(query, perPage).pipe(
          map((results) => {
            this.uiState.set('ready');
            return results ?? [];
          }),
          catchError(() => {
            this.uiState.set('error');
            this.errorMsg.set('Failed to fetch suggestions. Please try again later.');
            return of<Brewery[]>([]);
          }),
        );
      }),
    ),
    { initialValue: [] },
  );

  readonly isSearching = computed(() => this.query().length >= 3 && !(this.selected() !== null));

  readonly showMinLengthHWarning = computed(
    () => this.query().length > 0 && this.query().length < 3,
  );

  readonly isEmptyResults = computed(
    () =>
      isMeaningfulQuery(this.query(), 3) &&
      this.uiState() === 'ready' &&
      this.suggestions().length === 0,
  );

  readonly showDropdown = computed(() => {
    return (
      this.uiState() !== 'loading' &&
      this.suggestions().length > 0 &&
      this.selected() === null &&
      isMeaningfulQuery(this.query(), 3)
    );
  });

  readonly showAllSuggestions = computed(
    () => isMeaningfulQuery(this.query(), 3) && this.suggestions().length >= 5 && !this.showAll(),
  );

  readonly hasHistory = computed(() => this.historyitems().length > 0);

  clear(): void {
    this.queryCtrl.setValue('');
    this.selected.set(null);
    this.showAll.set(false);
    this.errorMsg.set(null);
    this.uiState.set('idle');
  }

  selectItem(item: Brewery): void {
    this.selected.set(item);
    this.showAll.set(false);
    this.history.add(item.name);
  }

  seeAllResults(): void {
    this.showAll.set(true);
  }

  closeDetailView(): void {
    this.selected.set(null);
  }

  removeHistoryItem(id: string): void {
    this.history.remove(id);
  }
}
