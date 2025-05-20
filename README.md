# SortLab

A TypeScript library for creating interactive sorting algorithm visualizations in web applications.

The single code file, `SortDemo.js`, contains an API for building sorting algorithms with 
operations like `compare`, `swap`, `shift`, and `insert`. It also includes a simple UI with buttons for starting, stopping, and resetting the visualization, as well as sliders for adjusting the number of elements and animation speed. Using the api functions will automatically update the UI.œ


## Features

- **Interactive Visualization**: Create a "playing field" with colored bars representing values in an array
- **Built-in Controls**: Comes with start, stop, reset, and shuffle buttons, plus sliders for element count and speed
- **Animation Methods**: Built-in methods for swapping, comparing, shifting, and inserting elements
- **Visual Feedback**: Color coding for different states (unsorted, sorted, pivot, comparing, swapping)
- **Customizable**: Adapt the visualizer to your needs with configurable options
- **Multiple Algorithm Examples**: Includes implementations of popular sorting algorithms 

## Installation

```bash
npm install sort-lab
```

## Quick Start

```html
<!DOCTYPE html>
<html>
<head>
  <title>Sort Visualizer</title>
</head>
<body>
  <div id="sort-container" style="width: 800px; height: 400px;"></div>
  
  <script src="node_modules/sort-lab/dist/bundle.js"></script>
  <script>
    // Create a new visualizer
    const visualizer = new SortVisualizer.SortVisualizer({
      container: '#sort-container',
      elementCount: 50,
      showControls: true
    });
    
    // Run a sorting algorithm
    SortVisualizer.SortAlgorithms.bubbleSort(visualizer);
  </script>
</body>
</html>
```

## Usage with TypeScript/ES Modules

```typescript
import { SortVisualizer, SortAlgorithms } from 'sort-lab';

// Create a new visualizer
const visualizer = new SortVisualizer({
  container: '#sort-container',
  elementCount: 50,
  showControls: true
});

// Run a sorting algorithm
SortAlgorithms.bubbleSort(visualizer);
```

## API Reference

### SortVisualizer

The main class for creating and manipulating a sort visualization.

#### Constructor Options

```typescript
interface SortVisualizerOptions {
  container: HTMLElement | string;  // Element or selector where the visualizer will be rendered
  data?: number[];                  // Optional data array to visualize
  elementCount?: number;            // Number of elements (default: 50)
  maxValue?: number;                // Maximum value for random data (default: 100)
  minValue?: number;                // Minimum value for random data (default: 1)
  delay?: number;                   // Animation delay in ms (default: 50)
  showControls?: boolean;           // Whether to show control buttons and sliders (default: true)
}
```

#### Methods

- `start()`: Start or resume the sorting animation
- `pause()`: Pause the sorting animation
- `reset()`: Reset the visualization to its initial state
- `shuffle()`: Randomly shuffle the bars
- `get(index)`: Get the value at a specific index
- `set(index, value)`: Set the value at a specific index
- `compare(i, j)`: Compare two values and highlight the bars
- `swap(i, j)`: Swap two bars
- `shift(startIndex, endIndex)`: Shift elements to create a space
- `insert(index, value)`: Insert a value at a specific position
- `markAsSorted(indices)`: Mark specific bars as sorted
- `setPivot(index)`: Set a bar as the pivot
- `getData()`: Get the current data array
- `setData(newData)`: Set new data array

### Bar States

```typescript
enum BarState {
  UNSORTED = 'unsorted',
  SORTED = 'sorted',
  PIVOT = 'pivot',
  COMPARING = 'comparing',
  SWAPPING = 'swapping'
}
```

### Included Algorithms

The library includes implementations of common sorting algorithms:

- Bubble Sort
- Selection Sort
- Insertion Sort
- Quick Sort
- Merge Sort

## Creating Custom Algorithms

You can easily implement your own sorting algorithms using the provided API:

```typescript
async function myCustomSort(visualizer) {
  const length = visualizer.getData().length;
  
  // Your sorting logic here
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length - i - 1; j++) {
      // Compare elements
      if (await visualizer.compare(j, j + 1)) {
        // Swap if needed
        await visualizer.swap(j, j + 1);
      }
    }
    // Mark as sorted
    visualizer.markAsSorted([length - i - 1]);
  }
}
```

## License

This project is licensed under the ISC License - see the LICENSE file for details. 
