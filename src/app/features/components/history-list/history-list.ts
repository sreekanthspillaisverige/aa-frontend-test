import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { formatIsoToYmdHm } from '../../../core/utils/datetime.util';
import { SearchHistoryItem } from '../../../core/models/search-history-item';

@Component({
  selector: 'app-history-list',
  imports: [],
  standalone: true,
  templateUrl: './history-list.html',
  styleUrl: './history-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryList {
  items = input<SearchHistoryItem[]>();
  removeItem = output<string>();
  readonly formatTime = formatIsoToYmdHm;

  remove(itemID: string): void {
    this.removeItem.emit(itemID);
  }
}
