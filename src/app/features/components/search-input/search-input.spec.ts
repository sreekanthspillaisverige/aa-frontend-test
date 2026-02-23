import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchInput } from './search-input';
import { FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('SearchInput', () => {
  let component: SearchInput;
  let fixture: ComponentFixture<SearchInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchInput],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchInput);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('control', new FormControl<string>('', { nonNullable: true }));
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('adds loading class when isLoading is true', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    const inputWrap = fixture.debugElement.query(By.css('.input-wrap'))
      .nativeElement as HTMLElement;

    expect(inputWrap.classList.contains('loading')).toBe(true);
  });

  it('shows clear button when input has value', () => {
    const f = TestBed.createComponent(SearchInput);
    const ctrl = new FormControl<string>('test', { nonNullable: true });
    f.componentRef.setInput('control', ctrl);
    f.componentRef.setInput('isLoading', false);
    f.detectChanges();

    const clearButton = f.debugElement.query(By.css('.clear-button'));
    const searchIcon = f.debugElement.query(By.css('.search-icon'));

    expect(clearButton).toBeTruthy();
    expect(searchIcon).toBeFalsy();
  });

  it('shows search icon when input is empty', () => {
    const ctrl = fixture.componentInstance.control();
    ctrl.setValue('');
    fixture.detectChanges();

    const searchIcon = fixture.debugElement.query(By.css('.search-icon'));

    expect(searchIcon).toBeTruthy();
  });

  it('clicking the clear button emits clear', () => {
    const f = TestBed.createComponent(SearchInput);
    const ctrl = new FormControl<string>('test', { nonNullable: true });
    f.componentRef.setInput('control', ctrl);
    f.componentRef.setInput('isLoading', false);
    let calls = 0;
    f.componentInstance.clear.subscribe(() => calls++);
    f.detectChanges();

    const btn = f.debugElement.query(By.css('button.clear-button'))
      .nativeElement as HTMLButtonElement;
    btn.click();

    expect(calls).toBe(1);
  });

  it('emits clear event when Escape key is pressed and input has value', () => {
    const f = TestBed.createComponent(SearchInput);
    const ctrl = new FormControl<string>('test', { nonNullable: true });
    f.componentRef.setInput('control', ctrl);
    f.componentRef.setInput('isLoading', false);
    f.detectChanges();

    const preventDeault = vi.fn();
    f.componentInstance.onKeydown({
      key: 'Escape',
      preventDefault: preventDeault,
    } as unknown as KeyboardEvent);
    
    expect(preventDeault).toHaveBeenCalledTimes(1);
  });

  it('does not emit clear event when Escape key is pressed and input is empty', () => {
    const ctrl = fixture.componentInstance.control();
    ctrl.setValue('');
    fixture.detectChanges();

    let calls = 0;
    fixture.componentInstance.clear.subscribe(() => calls++);
    const input = fixture.debugElement.query(By.css('input'));
    input.triggerEventHandler('keydown', new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(calls).toBe(0);
  });

  it('does not prevent default when Escape is pressed and input is empty/whitespace', () => {
    const f = TestBed.createComponent(SearchInput);

    const ctrl = new FormControl<string>('   ', { nonNullable: true });
    f.componentRef.setInput('control', ctrl);
    f.componentRef.setInput('isLoading', false);
    f.detectChanges();

    const preventDefault = vi.fn();
    f.componentInstance.onKeydown({ key: 'Escape', preventDefault } as unknown as KeyboardEvent);

    expect(preventDefault).not.toHaveBeenCalled();
  });
});
