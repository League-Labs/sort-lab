import { BarState } from './types';

/**
 * Represents a bar in the sorting visualization
 */
export class Bar {
  private element: HTMLElement;
  private _value: number;
  private _state: BarState;
  private originalIndex: number;
  private maxValue: number;

  /**
   * Creates a new bar
   * @param container The container element
   * @param value The numeric value of the bar
   * @param index The original index in the array
   * @param maxValue The maximum value in the array (for scaling)
   */
  constructor(
    container: HTMLElement,
    value: number,
    index: number,
    maxValue: number
  ) {
    this._value = value;
    this.originalIndex = index;
    this._state = BarState.UNSORTED;
    this.maxValue = maxValue;

    // Create the bar element
    this.element = document.createElement('div');
    this.element.className = 'sort-visualizer-bar';
    this.element.style.height = `${(value / maxValue) * 100}%`;
    this.element.dataset.value = value.toString();
    this.element.dataset.originalIndex = index.toString();
    this.updateStyle();

    container.appendChild(this.element);
  }

  /**
   * Get the current value of the bar
   */
  get value(): number {
    return this._value;
  }

  /**
   * Set the current value of the bar
   */
  set value(newValue: number) {
    this._value = newValue;
    this.element.dataset.value = newValue.toString();
    this.element.style.height = `${(newValue / this.maxValue) * 100}%`;
  }

  /**
   * Get the current state of the bar
   */
  get state(): BarState {
    return this._state;
  }

  /**
   * Set the state of the bar and update its appearance
   */
  set state(newState: BarState) {
    this._state = newState;
    this.updateStyle();
  }

  /**
   * Update the bar's appearance based on its state
   */
  private updateStyle(): void {
    // Remove all state classes
    this.element.classList.remove(
      'state-unsorted',
      'state-sorted',
      'state-pivot',
      'state-comparing',
      'state-swapping'
    );

    // Add the current state class
    this.element.classList.add(`state-${this._state}`);
  }
}
