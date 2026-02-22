import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailView } from './detail-view';
import { Brewery } from '../../../core/models/brewery.model';

describe('DetailView', () => {
  let component: DetailView;
  let fixture: ComponentFixture<DetailView>;

  const mockBrewery = {
    id: '1',
    name: 'Test Brewery',
    brewery_type: 'micro',
    address_1: '123 Test St',
    city: 'Testville',
    state_province: 'Test State',
    postal_code: '12345',
    country: 'Test Country',
    phone: '123-456-7890',
    website_url: 'http://testbrewery.com',
  } as Brewery;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailView],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailView);
    fixture.componentRef.setInput('brewery', mockBrewery);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders brewery name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Test Brewery');
  });

  it('renders brewery type', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Type: micro');
  });

  it('renders formatted address', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('123 Test St, Testville, Test State 12345');
  });

  it('renders country', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Country: Test Country');
  });

  it('renders website link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector('a');
    expect(link?.getAttribute('href')).toBe('http://testbrewery.com');
  });

  it('renders phone number', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('123-456-7890');
  });

  it('emits close event when close button is clicked', () => {
    let calls = 0;
    fixture.componentInstance.close.subscribe(() => calls++);
    const compiled = fixture.nativeElement as HTMLElement;
    const closeButton = compiled.querySelector('button');
    closeButton?.click();
    expect(calls).toBe(1);
  });

  it('handles missing address fields gracefully', () => {
    fixture.componentRef.setInput('brewery', {
      ...mockBrewery,
      address_1: null,
      city: null,
      state_province: null,
    });
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Test Country');
  });

  it('handles missing website URL gracefully', () => {
    fixture.componentRef.setInput('brewery', {
      ...mockBrewery,
      website_url: null,
    });
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector('a');
    expect(link).toBeNull();
  });

  it('does not render details when brewery input is missing', () => {
    fixture.componentRef.setInput('brewery', null);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')).toBeNull();
  });

  it('handles empty phone number gracefully', () => {
    fixture.componentRef.setInput('brewery', {
      ...mockBrewery,
      phone: '',
    });
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).not.toContain('123-456-7890');
  });

  it('handles empty brewery type gracefully', () => {
    fixture.componentRef.setInput('brewery', {
      ...mockBrewery,
      brewery_type: '',
    });
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Type:');
  });

  it('handles empty country gracefully', () => {
    fixture.componentRef.setInput('brewery', {
      ...mockBrewery,
      country: '',
    });
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Country:');
  });
});
