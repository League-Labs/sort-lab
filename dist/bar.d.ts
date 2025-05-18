import { BarState } from './types';
/**
 * Represents a bar in the sorting visualization
 */
export declare class Bar {
    private element;
    private _value;
    private _state;
    private originalIndex;
    private maxValue;
    /**
     * Creates a new bar
     * @param container The container element
     * @param value The numeric value of the bar
     * @param index The original index in the array
     * @param maxValue The maximum value in the array (for scaling)
     */
    constructor(container: HTMLElement, value: number, index: number, maxValue: number);
    /**
     * Get the current value of the bar
     */
    get value(): number;
    /**
     * Set the current value of the bar
     */
    set value(newValue: number);
    /**
     * Get the current state of the bar
     */
    get state(): BarState;
    /**
     * Set the state of the bar and update its appearance
     */
    set state(newState: BarState);
    /**
     * Update the bar's appearance based on its state
     */
    private updateStyle;
}
