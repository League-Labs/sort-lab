import { Bar } from './bar';
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
export class SortVisualizer {
  private container: HTMLElement;
  private barsContainer: HTMLElement;
  private controlsContainer: HTMLElement | null = null;
  private bars: Bar[] = [];
  private data: number[] = [];
  private elementCount: number;
  private maxValue: number;
  private minValue: number;
  private delay: number;
  private animationInProgress: boolean = false;
  private animationPaused: boolean = false;

  /**
   * Creates a new sort visualizer
   */
  constructor(options: SortVisualizerOptions) {
    // Get container element
    if (typeof options.container === 'string') {
      const containerElement = document.querySelector(options.container);
      if (!containerElement) {
        throw new Error(`Container element not found: ${options.container}`);
      }
      this.container = containerElement as HTMLElement;
    } else {
      this.container = options.container;
    }

    // Set default options
    this.elementCount = options.elementCount || 50;
    this.maxValue = options.maxValue || 100;
    this.minValue = options.minValue || 1;
    this.delay = options.delay || 50;

    // Initialize containers
    this.container.classList.add('sort-visualizer');
    
    this.barsContainer = document.createElement('div');
    this.barsContainer.className = 'sort-visualizer-bars';
    this.container.appendChild(this.barsContainer);

    // Initialize data
    if (options.data) {
      this.data = [...options.data];
      this.elementCount = options.data.length;
    } else {
      this.data = this.generateRandomData();
    }

    // Initialize controls if needed
    if (options.showControls !== false) {
      this.createControls();
    }

    // Initialize bars
    this.initializeBars();
  }

  /**
   * Generate random data for visualization
   */
  private generateRandomData(): number[] {
    const data: number[] = [];
    for (let i = 0; i < this.elementCount; i++) {
      data.push(
        Math.floor(Math.random() * (this.maxValue - this.minValue + 1)) + this.minValue
      );
    }
    return data;
  }

  /**
   * Create the UI controls for the visualizer
   */
  private createControls(): void {
    this.controlsContainer = document.createElement('div');
    this.controlsContainer.className = 'sort-visualizer-controls';
    
    // Create buttons
    const startButton = document.createElement('button');
    startButton.textContent = 'Start';
    startButton.addEventListener('click', () => this.start());
    
    const pauseButton = document.createElement('button');
    pauseButton.textContent = 'Pause';
    pauseButton.addEventListener('click', () => this.pause());
    
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.addEventListener('click', () => this.reset());
    
    const shuffleButton = document.createElement('button');
    shuffleButton.textContent = 'Shuffle';
    shuffleButton.addEventListener('click', () => this.shuffle());
    
    // Create sliders
    const elementCountContainer = document.createElement('div');
    elementCountContainer.className = 'slider-container';
    
    const elementCountLabel = document.createElement('label');
    elementCountLabel.textContent = 'Elements:';
    
    const elementCountSlider = document.createElement('input');
    elementCountSlider.type = 'range';
    elementCountSlider.min = '10';
    elementCountSlider.max = '200';
    elementCountSlider.value = this.elementCount.toString();
    elementCountSlider.addEventListener('change', () => {
      this.elementCount = parseInt(elementCountSlider.value);
      this.reset();
    });
    
    const speedContainer = document.createElement('div');
    speedContainer.className = 'slider-container';
    
    const speedLabel = document.createElement('label');
    speedLabel.textContent = 'Speed:';
    
    const speedSlider = document.createElement('input');
    speedSlider.type = 'range';
    speedSlider.min = '1';
    speedSlider.max = '100';
    speedSlider.value = (101 - this.delay).toString();
    speedSlider.addEventListener('change', () => {
      this.delay = 101 - parseInt(speedSlider.value);
    });
    
    // Append all controls
    elementCountContainer.appendChild(elementCountLabel);
    elementCountContainer.appendChild(elementCountSlider);
    
    speedContainer.appendChild(speedLabel);
    speedContainer.appendChild(speedSlider);
    
    this.controlsContainer.appendChild(startButton);
    this.controlsContainer.appendChild(pauseButton);
    this.controlsContainer.appendChild(resetButton);
    this.controlsContainer.appendChild(shuffleButton);
    this.controlsContainer.appendChild(elementCountContainer);
    this.controlsContainer.appendChild(speedContainer);
    
    this.container.appendChild(this.controlsContainer);
  }

  /**
   * Initialize the bars based on the current data
   */
  private initializeBars(): void {
    // Clear existing bars
    this.barsContainer.innerHTML = '';
    this.bars = [];
    
    // Find the max value for scaling
    const actualMaxValue = Math.max(...this.data);
    
    // Create new bars
    for (let i = 0; i < this.data.length; i++) {
      this.bars.push(new Bar(this.barsContainer, this.data[i], i, actualMaxValue));
    }
  }

  /**
   * Start or resume the sorting animation
   */
  start(): void {
    console.log('Start called, animation in progress:', this.animationInProgress, 'paused:', this.animationPaused);
    
    if (this.animationInProgress && this.animationPaused) {
      console.log('Resuming paused animation');
      this.animationPaused = false;
      return;
    }
    
    if (!this.animationInProgress) {
      console.log('Starting new animation');
      this.animationInProgress = true;
      this.animationPaused = false;
    }
  }

  /**
   * Pause the sorting animation
   */
  pause(): void {
    if (this.animationInProgress) {
      this.animationPaused = true;
    }
  }

  /**
   * Reset the visualization to its initial state
   */
  reset(): void {
    if (this.animationInProgress) {
      this.stop();
    }
    this.data = this.generateRandomData();
    this.initializeBars();
  }

  /**
   * Stop the current animation
   */
  private stop(): void {
    console.log('Stopping animation');
    this.animationInProgress = false;
    this.animationPaused = false;
  }

  /**
   * Shuffle the bars randomly
   */
  shuffle(): void {
    if (this.animationInProgress) {
      this.stop();
    }
    
    // Generate new random data
    this.data = this.generateRandomData();
    this.initializeBars();
  }

  /**
   * Set the state of multiple bars
   */
  setBarStates(indices: number[], state: BarState): void {
    for (const index of indices) {
      if (index >= 0 && index < this.bars.length) {
        this.bars[index].state = state;
      }
    }
  }

  /**
   * Set all bars to a specific state
   */
  setAllBarsState(state: BarState): void {
    for (const bar of this.bars) {
      bar.state = state;
    }
  }

  /**
   * Get the value at a specific index
   */
  get(index: number): number {
    if (index < 0 || index >= this.bars.length) {
      throw new Error(`Index out of bounds: ${index}`);
    }
    return this.bars[index].value;
  }

  /**
   * Set the value at a specific index
   */
  set(index: number, value: number): void {
    if (index < 0 || index >= this.bars.length) {
      throw new Error(`Index out of bounds: ${index}`);
    }
    this.bars[index].value = value;
    this.data[index] = value;
  }

  /**
   * Compare two values and highlight the bars
   */
  async compare(i: number, j: number): Promise<boolean> {
    if (i < 0 || i >= this.bars.length || j < 0 || j >= this.bars.length) {
      throw new Error(`Index out of bounds: ${i} or ${j}`);
    }
    
    // Highlight the bars being compared
    this.bars[i].state = BarState.COMPARING;
    this.bars[j].state = BarState.COMPARING;
    
    // Wait for the delay
    await this.wait();
    
    const result = this.bars[i].value > this.bars[j].value;
    
    // Return to normal state
    this.bars[i].state = BarState.UNSORTED;
    this.bars[j].state = BarState.UNSORTED;
    
    return result;
  }

  /**
   * Swap two bars
   */
  async swap(i: number, j: number): Promise<void> {
    if (i < 0 || i >= this.bars.length || j < 0 || j >= this.bars.length) {
      throw new Error(`Index out of bounds: ${i} or ${j}`);
    }
    
    // Highlight the bars being swapped
    this.bars[i].state = BarState.SWAPPING;
    this.bars[j].state = BarState.SWAPPING;
    
    // Wait for the delay
    await this.wait();
    
    // Swap the values
    const temp = this.bars[i].value;
    this.bars[i].value = this.bars[j].value;
    this.bars[j].value = temp;
    
    // Update the data array
    this.data[i] = this.bars[i].value;
    this.data[j] = this.bars[j].value;
    
    // Wait for the delay
    await this.wait();
    
    // Return to normal state
    this.bars[i].state = BarState.UNSORTED;
    this.bars[j].state = BarState.UNSORTED;
  }
  
  /**
   * Shift elements to the right to create a hole at a specific position
   */
  async shift(startIndex: number, endIndex: number): Promise<void> {
    if (startIndex < 0 || startIndex >= this.bars.length || 
        endIndex < 0 || endIndex >= this.bars.length) {
      throw new Error(`Index out of bounds: ${startIndex} or ${endIndex}`);
    }
    
    const direction = startIndex < endIndex ? 1 : -1;
    
    for (let i = endIndex; i !== startIndex; i -= direction) {
      // Highlight the bars being shifted
      this.bars[i].state = BarState.SWAPPING;
      this.bars[i - direction].state = BarState.SWAPPING;
      
      // Wait for the delay
      await this.wait();
      
      // Shift the value
      this.bars[i].value = this.bars[i - direction].value;
      this.data[i] = this.data[i - direction];
      
      // Wait for the delay
      await this.wait();
      
      // Return to normal state
      this.bars[i].state = BarState.UNSORTED;
      this.bars[i - direction].state = BarState.UNSORTED;
    }
  }
  
  /**
   * Insert a value at a specific position
   */
  async insert(index: number, value: number): Promise<void> {
    if (index < 0 || index >= this.bars.length) {
      throw new Error(`Index out of bounds: ${index}`);
    }
    
    // Highlight the bar
    this.bars[index].state = BarState.SWAPPING;
    
    // Wait for the delay
    await this.wait();
    
    // Set the value
    this.bars[index].value = value;
    this.data[index] = value;
    
    // Wait for the delay
    await this.wait();
    
    // Return to normal state
    this.bars[index].state = BarState.UNSORTED;
  }

  /**
   * Wait for the specified delay, respecting pause state
   */
  private async wait(): Promise<void> {
    console.log('Wait called, paused:', this.animationPaused);
    
    return new Promise<void>((resolve) => {
      if (this.animationPaused) {
        console.log('Animation is paused, waiting...');
        const interval = setInterval(() => {
          if (!this.animationPaused) {
            console.log('Animation resumed, continuing');
            clearInterval(interval);
            setTimeout(resolve, this.delay);
          }
        }, 100);
      } else {
        console.log(`Waiting for ${this.delay}ms`);
        setTimeout(resolve, this.delay);
      }
    });
  }

  /**
   * Mark bars as sorted
   */
  markAsSorted(indices: number[]): void {
    for (const index of indices) {
      if (index >= 0 && index < this.bars.length) {
        this.bars[index].state = BarState.SORTED;
      }
    }
  }

  /**
   * Set a bar as the pivot
   */
  setPivot(index: number): void {
    if (index >= 0 && index < this.bars.length) {
      this.bars[index].state = BarState.PIVOT;
    }
  }

  /**
   * Get current array data
   */
  getData(): number[] {
    return [...this.data];
  }

  /**
   * Set new array data
   */
  setData(newData: number[]): void {
    if (this.animationInProgress) {
      this.stop();
    }
    
    this.data = [...newData];
    this.elementCount = newData.length;
    this.initializeBars();
  }
}
