import { SortVisualizer } from './sort-visualizer-new';
/**
 * Implementation of various sorting algorithms using the visualizer
 */
export declare class SortAlgorithms {
    /**
     * Bubble Sort implementation
     */
    static bubbleSort(visualizer: SortVisualizer): Promise<void>;
    /**
     * Selection Sort implementation
     */
    static selectionSort(visualizer: SortVisualizer): Promise<void>;
    /**
     * Insertion Sort implementation
     */
    static insertionSort(visualizer: SortVisualizer): Promise<void>;
    /**
     * Quick Sort implementation
     */
    static quickSort(visualizer: SortVisualizer): Promise<void>;
    private static quickSortRecursive;
    private static partition;
    /**
     * Merge Sort implementation
     */
    static mergeSort(visualizer: SortVisualizer): Promise<void>;
    private static mergeSortRecursive;
    private static merge;
}
