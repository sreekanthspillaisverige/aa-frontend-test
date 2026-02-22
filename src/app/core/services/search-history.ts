import { Injectable, WritableSignal, computed, signal } from '@angular/core';
import { SearchHistoryItem } from '../models/search-history-item';
import { dateIso } from '../utils/datetime.util';
import { uID } from '../utils/id.util';

const STORAGE_KEY = 'brwery_search_history';
const MAX_ITEMS = 10;

@Injectable({
  providedIn: 'root',
})
export class SearchHistory {
  private readonly _items: WritableSignal<SearchHistoryItem[]> = signal(this.readFromStorage());
  readonly items = computed(() => this._items());

  private readFromStorage(): SearchHistoryItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter(
          (x: any) =>
            x &&
            typeof x.id === 'string' &&
            typeof x.label === 'string' &&
            typeof x.createdAt === 'string',
        )
        .slice(0, MAX_ITEMS);
    } catch {
      return [];
    }
  }

  private writeToStorage(items: SearchHistoryItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Non-critical: storage may be blocked by browser or quota exceeded. In that case, we simply won't persist the history, but the in-memory state will still work.
    }
  }

  add(label: string): void {
    const trimmedLabel = label.trim();
    if (!trimmedLabel) return;
    const current = this._items();
    const filtered = current.filter((x) => x.label.toLowerCase() !== trimmedLabel.toLowerCase());
    const next: SearchHistoryItem[] = [
      { id: uID(), label: trimmedLabel, createdAt: dateIso() },
      ...filtered,
    ].slice(0, MAX_ITEMS);
    this._items.set(next);
    this.writeToStorage(next);
  }

  remove(id: string): void {
    const next = this._items().filter((x) => x.id !== id);
    this._items.set(next);
    this.writeToStorage(next);
  }

  clear(): void {
    this._items.set([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Non-critical: storage may be unavailable (quota, privacy mode, SSR). In that case, we simply won't persist the cleared state, but the in-memory state will still work.
    }
  }
}
