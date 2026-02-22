import { Component, input, output } from '@angular/core';
import { Brewery } from '../../../core/models/brewery.model';

@Component({
  selector: 'app-suggestions-list',
  imports: [],
  templateUrl: './suggestions-list.html',
  styleUrl: './suggestions-list.scss',
})
export class SuggestionsList {
  readonly items = input.required<Brewery[]>();
  readonly showAll = input(false);
  readonly seeAll = output<void>();
  readonly selectItem = output<Brewery>();

  select(item: Brewery) {
    this.selectItem.emit(item);
  }

  seeAllResults() {
    this.seeAll.emit();
  }

  formatLocation(item: Brewery) {
    return (
      [item?.city, item?.state_province, item?.country].filter(Boolean).join(', ') ||
      'Not available'
    );
  }
}
