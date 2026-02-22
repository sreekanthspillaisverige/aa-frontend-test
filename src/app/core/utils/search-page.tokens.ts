import { InjectionToken } from '@angular/core';

export const SEARCH_DEBOUNCE_MS = new InjectionToken<number>('SEARCH_DEBOUNCE_MS', {
  factory: () => 300,
});
