// Add this enum at the top before the SortDemo class
enum PlayfieldType {
  RANDOM = 'random',
  SORTED_DOWN = 'sorted down',
  SORTED_UP = 'sorted up'
}

/**
 * SortDemo.ts
 * This file contains the SortDemo class which provides a visual representation of sorting algorithms.
 * It includes methods for creating a playfield, swapping elements, and running various sorting algorithms.
 *

/**
 * Type definition for sorting algorithms
 */
interface Algorithm {
  title: string;
  func: (n: number) => Promise<void>;
}

/**
 * Main class for Sort Visualization Demo
 * Provides interactive controls and visualization for sorting algorithms
 */
export class SortDemo {
  private playfield: HTMLElement;
  private startBtn: HTMLButtonElement;
  private stopBtn: HTMLButtonElement;
  private restartBtn: HTMLButtonElement;

  private newBtn: HTMLButtonElement;
  private speedSlider: HTMLInputElement;
  private algorithmSelect: HTMLSelectElement;
  private algorithmTitle: HTMLElement;
  
  private pauseDelay: number = 100; // Default speed in ms
  private speedSlowest = 1000;
  private speedFastest = 10;
  private barCount = 25;
  private minHeight = 30;
  private maxHeight = 320;
  
  // Control flags
  private isSorting: boolean = false; // Is a sort in progress?
  private isPaused: boolean = false; // Is the sort paused?
  
  // Available sorting algorithms
  private algorithms: Algorithm[] = [
    { title: "Bubble Sort", func: this.bubbleSort.bind(this) },
    { title: "Insertion Sort (Swap)", func: this.insertionSortSwap.bind(this) },
    { title: "Insertion Sort (Move)", func: this.insertionSortMove.bind(this) }
  ];
  
  // Currently selected algorithm
  private currentAlgorithm: Algorithm;

  // Add a new property to track the current playfield type
  private currentPlayfieldType: PlayfieldType = PlayfieldType.RANDOM;

  constructor() {
    this.playfield = document.getElementById('playfield')!;
    this.startBtn = document.getElementById('start-btn') as HTMLButtonElement;
    this.stopBtn = document.getElementById('stop-btn') as HTMLButtonElement;
    this.restartBtn = document.getElementById('restart-btn') as HTMLButtonElement;
   
    this.newBtn = document.getElementById('new-btn') as HTMLButtonElement;
    this.speedSlider = document.getElementById('speed-slider') as HTMLInputElement;
    this.algorithmSelect = document.getElementById('algorithm-select') as HTMLSelectElement;
    this.algorithmTitle = document.getElementById('algorithm-title')!;

    this.newBtn.addEventListener('click', () => this.createNewPlayfield());
    this.startBtn.addEventListener('click', () => this.handleStartClick());
    this.stopBtn.addEventListener('click', () => this.handleStopClick());
    
    // Check if restart button exists before adding event listener
    if (this.restartBtn) {
      this.restartBtn.addEventListener('click', () => this.handleRestartClick());
    }

    // Set up speed slider
    if (this.speedSlider) {
      this.updateSpeedFromSlider();
      this.speedSlider.addEventListener('input', () => this.updateSpeedFromSlider());
    }

    // Set up algorithm selection
    if (this.algorithmSelect) {
      // Clear any existing options first
      this.algorithmSelect.innerHTML = '';
      
      // Add options for each algorithm
      this.algorithms.forEach((algo, index) => {
        const option = document.createElement('option');
        option.value = index.toString();
        option.textContent = algo.title;
        this.algorithmSelect.appendChild(option);
      });
      
      // Set the change event listener
      this.algorithmSelect.addEventListener('change', () => this.updateAlgorithm());
    }
    
    // Set default algorithm
    this.currentAlgorithm = this.algorithms[0];
    
    // Update the title
    if (this.algorithmTitle) {
      this.algorithmTitle.textContent = this.currentAlgorithm.title;
    }
    
    // Create initial playfield with random bars
    this.createNewPlayfield();

    // Fix dropdown menu implementation for the New button
    if (this.newBtn) {
      // Add a container div to better manage positioning
      const buttonContainer = document.createElement('div');
      buttonContainer.style.position = 'relative';
      buttonContainer.style.display = 'inline-block';
      
      // Clone the current button to preserve event listeners
      const newBtnClone = this.newBtn.cloneNode(true) as HTMLButtonElement;
      
      // Update the button to include the dropdown arrow
      newBtnClone.innerHTML = 'New <span class="dropdown-arrow">▼</span>';
      
      // Replace the original button with our container
      this.newBtn.parentNode?.insertBefore(buttonContainer, this.newBtn);
      buttonContainer.appendChild(newBtnClone);
      this.newBtn.parentNode?.removeChild(this.newBtn);
      
      // Update the button reference
      this.newBtn = newBtnClone;
      
      // Create dropdown menu
      const dropdownMenu = document.createElement('div');
      dropdownMenu.className = 'dropdown-menu';
      dropdownMenu.style.display = 'none';
      dropdownMenu.style.position = 'absolute';
      dropdownMenu.style.top = '100%';
      dropdownMenu.style.left = '0';
      dropdownMenu.style.backgroundColor = '#f9f9f9';
      dropdownMenu.style.minWidth = '120px';
      dropdownMenu.style.boxShadow = '0px 8px 16px 0px rgba(0,0,0,0.2)';
      dropdownMenu.style.zIndex = '1';
      
      // Add options to the dropdown menu
      const options = [
        { type: PlayfieldType.RANDOM, label: 'Random' },
        { type: PlayfieldType.SORTED_UP, label: 'Sorted Up' },
        { type: PlayfieldType.SORTED_DOWN, label: 'Sorted Down' }
      ];
      
      options.forEach(({ type, label }) => {
        const item = document.createElement('a');
        item.textContent = label;
        item.style.padding = '12px 16px';
        item.style.textDecoration = 'none';
        item.style.display = 'block';
        item.style.color = 'black';
        item.style.cursor = 'pointer';
        
        item.addEventListener('mouseenter', () => {
          item.style.backgroundColor = '#f1f1f1';
        });
        
        item.addEventListener('mouseleave', () => {
          item.style.backgroundColor = 'transparent';
        });
        
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          this.currentPlayfieldType = type;
          dropdownMenu.style.display = 'none';
          this.createNewPlayfield();
        });
        
        dropdownMenu.appendChild(item);
      });
      
      // Append dropdown to the container
      buttonContainer.appendChild(dropdownMenu);
      
      // Handle button click - toggle dropdown menu
      this.newBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = dropdownMenu.style.display === 'block';
        dropdownMenu.style.display = isVisible ? 'none' : 'block';
      });
      
      // Close dropdown when clicking elsewhere
      document.addEventListener('click', () => {
        dropdownMenu.style.display = 'none';
      });
    }
  }

  /**
   * Handles Start button click - either starts sorting or resumes if paused
   */
  handleStartClick() {
    if (this.isSorting && this.isPaused) {
      // Resume the sorting
      this.isPaused = false;
      this.startBtn.textContent = 'Pause';
    } else if (!this.isSorting) {
      // Start new sorting
      this.isSorting = true;
      this.isPaused = false;
      this.startBtn.textContent = 'Pause';
      this.sortRunner();
    } else {
      // Pause the sorting
      this.isPaused = true;
      this.startBtn.textContent = 'Resume';
    }
  }

  /**
   * Handles Stop button click - stops the current sorting operation
   */
  handleStopClick() {
    this.isSorting = false;
    this.isPaused = false;
    this.startBtn.textContent = 'Start';
    this.clearMarks(true);
  }

  /**
   * Handles Restart button click - stops current sorting and starts a new sort
   * without generating new bars
   */
  handleRestartClick() {
    // First stop the current sorting
    this.isSorting = false;
    this.isPaused = false;
    
    // Clear all marks
    this.clearMarks(true);
    
    // Start sorting again
    this.isSorting = true;
    this.startBtn.textContent = 'Pause';
    this.sortRunner();
  }

  /**
   * Updates speed value based on the current slider position
   * Left = slow, right = fast, with values mapped between speedSlowest and speedFastest
   */
  updateSpeedFromSlider() {
    // Convert slider value (10-500) to speed (2000ms to 50ms)
    // Invert the slider value (left = slow, right = fast)
    const sliderValue = parseInt(this.speedSlider.value);
    const sliderMin = parseInt(this.speedSlider.min);
    const sliderMax = parseInt(this.speedSlider.max);
    const normalizedValue = (sliderValue - sliderMin) / (sliderMax - sliderMin); // 0 to 1
    const invertedValue = 1 - normalizedValue; // 1 to 0
    this.pauseDelay = Math.floor(invertedValue * (this.speedSlowest - this.speedFastest) + this.speedFastest); // 2000ms to 50ms
  }

  /**
   * Creates a new playfield with bars according to the selected type
   * Clears any existing bars and generates a new set with appropriate heights
   */
  createNewPlayfield() {
    // Stop any ongoing sorting when creating a new playfield
    this.isSorting = false;
    this.isPaused = false;
    this.startBtn.textContent = 'Start';
    
    // Remove all bars and generate new ones
    this.playfield.innerHTML = '';
    
    switch(this.currentPlayfieldType) {
      case PlayfieldType.SORTED_UP:
        // Create array sorted in ascending order
        for (let i = 0; i < this.barCount; i++) {
          const bar = document.createElement('div');
          bar.className = 'bar';
          // Calculate height to create an ascending pattern
          const height = Math.floor((i + 1) * (this.maxHeight - this.minHeight) / this.barCount) + this.minHeight;
          bar.style.height = height + 'px';
          this.playfield.appendChild(bar);
        }
        break;
        
      case PlayfieldType.SORTED_DOWN:
        // Create array sorted in descending order
        for (let i = 0; i < this.barCount; i++) {
          const bar = document.createElement('div');
          bar.className = 'bar';
          // Calculate height to create a descending pattern
          const height = Math.floor((this.barCount - i) * (this.maxHeight - this.minHeight) / this.barCount) + this.minHeight;
          bar.style.height = height + 'px';
          this.playfield.appendChild(bar);
        }
        break;
        
      case PlayfieldType.RANDOM:
      default:
        // Create array with random heights
        for (let i = 0; i < this.barCount; i++) {
          const bar = document.createElement('div');
          bar.className = 'bar';
          const height = Math.floor(Math.random() * (this.maxHeight - this.minHeight + 1)) + this.minHeight;
          bar.style.height = height + 'px';
          this.playfield.appendChild(bar);
        }
        break;
    }
    
    // Remove any CommonJS exports from the global scope (browser only)
    if (typeof (window as any).exports !== 'undefined') {
      try { delete (window as any).exports; } catch (e) { /* ignore */ }
    }
  }

  /**
   * Swaps two bars in the visualization
   * @param i Index of first bar to swap
   * @param j Index of second bar to swap
   */
  async swap(i: number, j: number) {
    const bars = this.playfield.children;
    if (i < 0 || j < 0 || i >= bars.length || j >= bars.length) return;
    
    await this.pause(3);

    // Mark bars as being swapped

    const barI = this.getBar(i);
    const barJ = this.getBar(j);
    if (!barI || !barJ) return;
    
    barI.className = 'bar swap';
    barJ.className = 'bar swap';

    // Don't need to swap the DOM elements, just swap the heights
    const tempHeight = barI.style.height;
    barI.style.height = barJ.style.height;
    barJ.style.height = tempHeight;

    await this.pause(3);

    barI.className = 'bar';
    barJ.className = 'bar';
  }

  /**
   * Moves a bar from one position to another
   * @param i Source index
   * @param j Destination index
   */
  async move(i: number, j: number) {
    const bars = this.playfield.children;
    if (i < 0 || j < 0 || i >= bars.length || j >= bars.length || i === j) return;
    
    const barToMove = bars[i] as HTMLElement;
    
    // Mark the bar being moved
    barToMove.className = 'bar swap';
    
    // Pause before removing
    await this.pause(4);
    
    // Remove the bar at i
    this.playfield.removeChild(barToMove);
    
    // Insert at new position j
    if (j >= this.playfield.children.length) {
      this.playfield.appendChild(barToMove);
    } else {
      this.playfield.insertBefore(barToMove, this.playfield.children[j]);
    }
    
    // Pause after inserting
    await this.pause(4);

    barToMove.className = 'bar';
  }

  /**
   * Gets the bar element at the specified index
   * @param i Index of the bar to retrieve
   * @returns The HTMLElement of the bar or null if out of bounds
   */
  getBar(i: number): HTMLElement | null {
    const bars = this.playfield.children;
    if (i < 0 || i >= bars.length) return null;
    return bars[i] as HTMLElement;
  }

  /**
   * Gets the height value of a bar at the specified index
   * @param i Index of the bar
   * @returns The height value as a number or null if not available
   */
  get(i: number): number | null {
    const bars = this.playfield.children;
    if (i < 0 || i >= bars.length) return null;
    const bar = this.getBar(i)
    if (!bar) return null;
    return parseInt(bar.style.height, 10);
  }

  /**
   * Compares the heights of two bars and visually highlights them
   * @param i Index of first bar
   * @param j Index of second bar
   * @returns -1 if i < j, 1 if i > j, 0 if equal, null if invalid indices
   */
  compare(i: number, j: number): number {
    const bars = this.playfield.children;
    if (i < 0 || j < 0 || i >= bars.length || j >= bars.length) return 0;
    
    this.clearMarks();

    // Mark bars as being compared
    const barI = this.getBar(i);
    const barJ = this.getBar(j);
    if (barI) barI.className = 'bar compare';
    if (barJ) barJ.className = 'bar compare';
    
    const valI = this.get(i);
    const valJ = this.get(j);
    if (valI === null || valJ === null) return 0;
    if (valI < valJ) return -1;
    if (valI > valJ) return 1;
    return 0;
  }

  /**
   * Marks a bar as sorted (final position)
   * @param i Index of the bar to mark as sorted
   */
  markSorted(i: number) {
    const bar = this.getBar(i);
    if (bar) {
      bar.className = 'bar sorted';
    }
  }

  /**
   * Clears visual markings on bars
   * @param clearSorted Whether to also clear the 'sorted' status (default: false)
   */
  clearMarks(clearSorted: boolean = false) {
    const bars = this.playfield.children;
    for (let i = 0; i < bars.length; i++) {
      const bar = bars[i] as HTMLElement;
      if (clearSorted || !bar.className.includes('sorted')) {
        bar.className = bar.className.includes('sorted') && !clearSorted ? 'bar sorted' : 'bar';
      }
    }
  }

  /**
   * Pauses execution for a specified duration
   * Checks for pause/stop conditions and handles them
   * 
   * @param ratio Optional speed adjustment ratio (default: 1)
   * @returns Promise that resolves after the delay or when unpaused
   */
  async pause(ratio: number = 1) {
    if (!this.isSorting) {
      // If sorting has been stopped completely
      throw new Error('Sorting stopped');
    }
    
    if (this.isPaused) {
      // If paused, wait until unpaused
      return new Promise<void>(resolve => {
        const checkPaused = () => {
          if (!this.isPaused) {
            // No longer paused, continue
            resolve();
          } else if (!this.isSorting) {
            // Sorting stopped while paused
            throw new Error('Sorting stopped');
          } else {
            // Still paused, check again after a short delay
            setTimeout(checkPaused, 100);
          }
        };
        
        checkPaused();
      });
    }
    
    // Normal delay based on speed setting
    return new Promise(resolve => setTimeout(resolve, this.pauseDelay/ratio));
  }


  /**
   * Updates the algorithm based on the current selection in the dropdown
   */
  updateAlgorithm() {
    const selectedIndex = parseInt(this.algorithmSelect.value);
    this.currentAlgorithm = this.algorithms[selectedIndex];
    this.algorithmTitle.textContent = this.currentAlgorithm.title;
    
    // Reset to start if we were in the middle of a sort
    if (this.isSorting) {
      this.handleStopClick();
    }
  }

  /**
   * Runs the selected sorting algorithm with error handling
   */
  async sortRunner() {
    try {
      // Get the number of elements to sort
      const n = this.playfield.children.length;
      
      // Run the insertion sort algorithm with the number of elements
      await this.currentAlgorithm.func(n);
      
      // Sorting completed successfully
      this.isSorting = false;
      this.startBtn.textContent = 'Start';
    } catch (e) {
      // Sorting was stopped, do nothing
      console.log('Sorting interrupted');
    }
  }

  /**  =========================================
   * 
   *   Sorting Algorithms
   * 
   *   ========================================= */


  /**
   * Implements the bubble sort algorithm with visualization
   * Repeatedly steps through the list, compares adjacent elements, and swaps them if needed
   * @param n The number of elements to sort
   */
  async bubbleSort(n: number) {
    let i: number = 0
    let j: number = 0

    for (i = 0; i < n - 1; i++) {
      for (j = 0; j < n - i - 1; j++) {
        
        if (this.compare(j, j + 1) > 0) {
          await this.swap(j, j + 1);
        
        }
      }
      // Mark the largest element as sorted after each pass
      this.markSorted(j);
    }

  }

  /**
   * Implements the insertion sort algorithm with visualization
   * For each element, insert it into its correct position in the sorted part of the array
   * @param n The number of elements to sort
   */
  async insertionSortSwap(n: number) {
    // Mark the first element as sorted initially
    this.markSorted(0);
    
    // Start from the second element (index 1)
    for (let i = 1; i < n; i++) {
      // Insert element at position i into the sorted sequence
      let j = i;
      
      // Compare the current element with previous elements and swap when needed
      while (j > 0) {

        if (this.compare(j - 1, j) > 0) {
          // If previous element is greater, swap them
          await this.swap(j - 1, j);
          j--;
        } else {
          // Element is in correct position, stop
          break;
        }
      }
      
      // Mark the current element as sorted
      this.markSorted(i);
    }
  }

  /**
   * Implements the insertion sort algorithm using move operations
   * For each element, insert it directly into its correct position in the sorted part of the array
   * @param n The number of elements to sort
   */
  async insertionSortMove(n: number) {
    // Mark the first element as sorted
    this.markSorted(0);

    for (let i = 1; i < n; i++) {

      let j = 0;

      // Find where to insert val in the sorted portion
      while (j < i && this.compare(j, i) <= 0) {
        j++;
      }

      if (j < i) {
        // Move the element to its new position
        await this.move(i, j);
        // Mark sorted section
        for (let k = 0; k <= i; k++) {
          this.markSorted(k);
        }
      } else {
        // No move needed, just mark as sorted
        this.markSorted(i);
      }
    }
  }

}


