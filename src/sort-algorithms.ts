import { SortVisualizer } from './sort-visualizer-new';
import { BarState } from './types';

/**
 * Implementation of various sorting algorithms using the visualizer
 */
export class SortAlgorithms {
  /**
   * Bubble Sort implementation
   */
  static async bubbleSort(visualizer: SortVisualizer): Promise<void> {
    console.log("Starting bubble sort algorithm");
    const n = visualizer.getData().length;
    
    for (let i = 0; i < n; i++) {
      let swapped = false;
      
      for (let j = 0; j < n - i - 1; j++) {
        // Compare adjacent elements
        console.log(`Comparing ${j} and ${j+1}`);
        if (await visualizer.compare(j, j + 1)) {
          // Swap them if they are in the wrong order
          console.log(`Swapping ${j} and ${j+1}`);
          await visualizer.swap(j, j + 1);
          swapped = true;
        }
      }
      
      // Mark the last element as sorted
      visualizer.markAsSorted([n - i - 1]);
      
      // If no swapping occurred, array is sorted
      if (!swapped) {
        // Mark all remaining elements as sorted
        const remainingIndices = Array.from({ length: n - i - 1 }, (_, idx) => idx);
        visualizer.markAsSorted(remainingIndices);
        break;
      }
    }
  }
  
  /**
   * Selection Sort implementation
   */
  static async selectionSort(visualizer: SortVisualizer): Promise<void> {
    const n = visualizer.getData().length;
    
    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;
      
      // Find the minimum element in the unsorted part
      for (let j = i + 1; j < n; j++) {
        if (await visualizer.compare(minIndex, j)) {
          minIndex = j;
        }
      }
      
      // Swap the found minimum element with the first element
      if (minIndex !== i) {
        await visualizer.swap(i, minIndex);
      }
      
      // Mark the element as sorted
      visualizer.markAsSorted([i]);
    }
    
    // Mark the last element as sorted
    visualizer.markAsSorted([n - 1]);
  }
  
  /**
   * Insertion Sort implementation
   */
  static async insertionSort(visualizer: SortVisualizer): Promise<void> {
    const n = visualizer.getData().length;
    
    // Mark the first element as sorted
    visualizer.markAsSorted([0]);
    
    for (let i = 1; i < n; i++) {
      const key = visualizer.get(i);
      let j = i - 1;
      
      // Move elements greater than key one position ahead
      while (j >= 0 && visualizer.get(j) > key) {
        await visualizer.set(j + 1, visualizer.get(j));
        j--;
      }
      
      // Place the key in its correct position
      await visualizer.set(j + 1, key);
      
      // Mark elements as sorted
      const sortedIndices = Array.from({ length: i + 1 }, (_, idx) => idx);
      visualizer.markAsSorted(sortedIndices);
    }
  }
  
  /**
   * Quick Sort implementation
   */
  static async quickSort(visualizer: SortVisualizer): Promise<void> {
    const data = visualizer.getData();
    await this.quickSortRecursive(visualizer, 0, data.length - 1);
    
    // Mark all elements as sorted when done
    const allIndices = Array.from({ length: data.length }, (_, idx) => idx);
    visualizer.markAsSorted(allIndices);
  }
  
  private static async quickSortRecursive(
    visualizer: SortVisualizer,
    low: number,
    high: number
  ): Promise<void> {
    if (low < high) {
      const pivotIndex = await this.partition(visualizer, low, high);
      
      // Mark the pivot as sorted
      visualizer.markAsSorted([pivotIndex]);
      
      // Recursively sort the sub-arrays
      await this.quickSortRecursive(visualizer, low, pivotIndex - 1);
      await this.quickSortRecursive(visualizer, pivotIndex + 1, high);
    } else if (low === high) {
      // Single element is always sorted
      visualizer.markAsSorted([low]);
    }
  }
  
  private static async partition(
    visualizer: SortVisualizer,
    low: number,
    high: number
  ): Promise<number> {
    // Choose the rightmost element as the pivot
    const pivot = visualizer.get(high);
    visualizer.setPivot(high);
    
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
      // Compare the current element with the pivot
      if (visualizer.get(j) <= pivot) {
        i++;
        
        // Swap elements
        if (i !== j) {
          await visualizer.swap(i, j);
        }
      }
    }
    
    // Swap the pivot element to its correct position
    if (i + 1 !== high) {
      await visualizer.swap(i + 1, high);
    }
    
    // Reset the pivot's state
    visualizer.setBarStates([high], BarState.UNSORTED);
    
    return i + 1;
  }
  
  /**
   * Merge Sort implementation
   */
  static async mergeSort(visualizer: SortVisualizer): Promise<void> {
    const data = visualizer.getData();
    await this.mergeSortRecursive(visualizer, 0, data.length - 1);
    
    // Mark all elements as sorted when done
    const allIndices = Array.from({ length: data.length }, (_, idx) => idx);
    visualizer.markAsSorted(allIndices);
  }
  
  private static async mergeSortRecursive(
    visualizer: SortVisualizer,
    left: number,
    right: number
  ): Promise<void> {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      
      // Split the array and sort the sub-arrays
      await this.mergeSortRecursive(visualizer, left, mid);
      await this.mergeSortRecursive(visualizer, mid + 1, right);
      
      // Merge the sorted sub-arrays
      await this.merge(visualizer, left, mid, right);
    }
  }
  
  private static async merge(
    visualizer: SortVisualizer,
    left: number,
    mid: number,
    right: number
  ): Promise<void> {
    const n1 = mid - left + 1;
    const n2 = right - mid;
    
    // Create temporary arrays
    const leftArray: number[] = [];
    const rightArray: number[] = [];
    
    // Copy data to temporary arrays
    for (let i = 0; i < n1; i++) {
      leftArray[i] = visualizer.get(left + i);
    }
    
    for (let j = 0; j < n2; j++) {
      rightArray[j] = visualizer.get(mid + 1 + j);
    }
    
    // Merge the arrays back
    let i = 0;
    let j = 0;
    let k = left;
    
    while (i < n1 && j < n2) {
      if (leftArray[i] <= rightArray[j]) {
        await visualizer.set(k, leftArray[i]);
        i++;
      } else {
        await visualizer.set(k, rightArray[j]);
        j++;
      }
      k++;
    }
    
    // Copy remaining elements from left array
    while (i < n1) {
      await visualizer.set(k, leftArray[i]);
      i++;
      k++;
    }
    
    // Copy remaining elements from right array
    while (j < n2) {
      await visualizer.set(k, rightArray[j]);
      j++;
      k++;
    }
  }
}
