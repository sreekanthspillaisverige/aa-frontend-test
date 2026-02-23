import { Component, input, output } from '@angular/core';
import { Brewery } from '../../../core/models/brewery.model';

@Component({
  selector: 'app-detail-view',
  imports: [],
  standalone: true,
  templateUrl: './detail-view.html',
  styleUrl: './detail-view.scss',
})
export class DetailView {
  brewery = input.required<Brewery>();
  close = output<void>();

  closeDetailView() {
    this.close.emit();
  }

  formatAddress(brewery: any): string {
    return (
      [brewery.address_1, brewery.city, brewery.state_province].filter(Boolean).join(', ') +
      (brewery.postal_code ? ` ${brewery.postal_code}` : '')
    );
  }
}
