import { Bar } from './bar';
import { SortVisualizer } from './sort-visualizer-new';
import { SortAlgorithms } from './sort-algorithms';
import { BarState } from './types';
import { injectStyles } from './styles';

// Inject styles automatically
injectStyles();

// Create a default export object with all components
const sortVisualizer = {
  Bar,
  SortVisualizer,
  SortAlgorithms,
  BarState,
  injectStyles
};

// Also export components individually
export {
  Bar,
  SortVisualizer,
  SortAlgorithms,
  BarState,
  injectStyles
};

// Default export
export default sortVisualizer;
