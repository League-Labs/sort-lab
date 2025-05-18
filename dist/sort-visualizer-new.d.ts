import { BarState } from './types';
/**
 * Configuration options for the SortVisualizer
 */
export interface SortVisualizerOptions {
    container: HTMLElement | string;
    data?: number[];
    elementCount?: number;
    maxValue?: number;
    minValue?: number;
    delay?: number;
    showControls?: boolean;
}
/**
 * Main class for creating and manipulating a sort visualization
 */
export declare class SortVisualizer {
    private container;
    private barsContainer;
    private controlsContainer;
    private bars;
    private data;
    private elementCount;
    private maxValue;
    private minValue;
    private delay;
    private running;
    private paused;
    /**
     * Creates a new sort visualizer
     */
    constructor(options: SortVisualizerOptions);
    /**
     * Generate random data for visualization
     */
    private generateRandomData;
    /**
     * Create the UI controls for the visualizer
     */
    private createControls;
    /**
     * Initialize the bars based on the current data
     */
    private initializeBars;
    /**
     * Start or resume the sorting animation
     */
    start(): void;
    /**
     * Pause the sorting animation
     */
    pause(): void;
    /**
     * Reset the visualization to its initial state
     */
    reset(): void;
    /**
     * Shuffle the bars randomly
     */
    shuffle(): void;
    /**
     * Set the state of multiple bars
     */
    setBarStates(indices: number[], state: BarState): void;
    /**
     * Set all bars to a specific state
     */
    setAllBarsState(state: BarState): void;
    /**
     * Get the value at a specific index
     */
    get(index: number): number;
    /**
     * Set the value at a specific index
     */
    set(index: number, value: number): void;
    /**
     * Compare two values and highlight the bars
     */
    compare(i: number, j: number): Promise<boolean>;
    /**
     * Swap two bars
     */
    swap(i: number, j: number): Promise<void>;
    /**
     * Shift elements to the right to create a hole at a specific position
     */
    shift(startIndex: number, endIndex: number): Promise<void>;
    /**
     * Insert a value at a specific position
     */
    insert(index: number, value: number): Promise<void>;
    /**
     * Wait for the specified delay, respecting pause state
     */
    private wait;
    /**
     * Mark bars as sorted
     */
    markAsSorted(indices: number[]): void;
    /**
     * Set a bar as the pivot
     */
    setPivot(index: number): void;
    /**
     * Get current array data
     */
    getData(): number[];
    /**
     * Set new array data
     */
    setData(newData: number[]): void;
    /**
     * Check if the visualizer is currently running
     */
    isRunning(): boolean;
    /**
     * Check if the visualizer is currently paused
     */
    isPaused(): boolean;
}
