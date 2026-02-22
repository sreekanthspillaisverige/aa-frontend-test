import { Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search-input.html',
  styleUrl: './search-input.scss',
})
export class SearchInput {
  readonly isLoading = input<boolean>(false);
  readonly control = input.required<FormControl>();
  readonly clear = output<void>();

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && (this.control().value ?? '').trim().length > 0) {
      event.preventDefault();
    }
  }

  clearClicked(): void {
    this.clear.emit();
  }
}
