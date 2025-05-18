/**
 * Default styles for the sort visualizer
 */
export const sortVisualizerStyles = `
.sort-visualizer {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.sort-visualizer-bars {
  display: flex;
  align-items: flex-end;
  height: 80%;
  width: 100%;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  padding: 10px;
  box-sizing: border-box;
}

.sort-visualizer-bar {
  flex: 1;
  margin: 0 1px;
  transition: height 0.1s ease-in-out;
  background-color: #6c757d;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}

.sort-visualizer-bar.state-unsorted {
  background-color: #6c757d;
}

.sort-visualizer-bar.state-sorted {
  background-color: #28a745;
}

.sort-visualizer-bar.state-pivot {
  background-color: #dc3545;
}

.sort-visualizer-bar.state-comparing {
  background-color: #ffc107;
}

.sort-visualizer-bar.state-swapping {
  background-color: #17a2b8;
}

.sort-visualizer-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.sort-visualizer-controls button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.sort-visualizer-controls button:hover {
  background-color: #0069d9;
}

.sort-visualizer-controls button:focus {
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.slider-container label {
  margin-right: 5px;
  font-size: 14px;
}

.slider-container input {
  cursor: pointer;
}
`;

/**
 * Injects the styles into the document
 */
export function injectStyles(): void {
  if (typeof document === 'undefined') return;
  
  const styleId = 'sort-visualizer-styles';
  
  // Check if styles are already injected
  if (document.getElementById(styleId)) return;
  
  // Create and append the style element
  const styleElement = document.createElement('style');
  styleElement.id = styleId;
  styleElement.textContent = sortVisualizerStyles;
  document.head.appendChild(styleElement);
}
