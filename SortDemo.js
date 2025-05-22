var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Add this enum at the top before the SortDemo class
var PlayfieldType;
(function (PlayfieldType) {
    PlayfieldType["RANDOM"] = "random";
    PlayfieldType["SORTED_DOWN"] = "sorted down";
    PlayfieldType["SORTED_UP"] = "sorted up";
})(PlayfieldType || (PlayfieldType = {}));
/**
 * Main class for Sort Visualization Demo
 * Provides interactive controls and visualization for sorting algorithms
 */
export class SortDemo {
    constructor() {
        var _a, _b;
        this.pauseDelay = 100; // Default speed in ms
        this.speedSlowest = 1000;
        this.speedFastest = 10;
        this.barCount = 25;
        this.minHeight = 30;
        this.maxHeight = 320;
        // Control flags
        this.isSorting = false; // Is a sort in progress?
        this.isPaused = false; // Is the sort paused?
        // States for color-coding during quicksort
        this.states = []; // 0: normal, 1: pivot, 2: compared, 3: sorted
        // Available sorting algorithms
        this.algorithms = [
            { title: "Bubble Sort", func: this.bubbleSort.bind(this) },
            { title: "Finn's Bubble Sort Visualizer", func: this.bubbleSort.bind(this) },
            { title: "Insertion Sort (Swap)", func: this.insertionSortSwap.bind(this) },
            { title: "Insertion Sort (Move)", func: this.insertionSortMove.bind(this) },
            { title: "Gabrio Norton Quicksort", func: this.quicksort.bind(this) },
            { title: "Aleks Insertion Sort Visualizer", func: this.aleksInsertionSortVisualizer.bind(this) }
        ];
        // Add a new property to track the current playfield type
        this.currentPlayfieldType = PlayfieldType.RANDOM;
        this.playfield = document.getElementById('playfield');
        this.startBtn = document.getElementById('start-btn');
        this.stopBtn = document.getElementById('stop-btn');
        this.restartBtn = document.getElementById('restart-btn');
        this.newBtn = document.getElementById('new-btn');
        this.speedSlider = document.getElementById('speed-slider');
        this.algorithmSelect = document.getElementById('algorithm-select');
        this.algorithmTitle = document.getElementById('algorithm-title');
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
            const newBtnClone = this.newBtn.cloneNode(true);
            // Update the button to include the dropdown arrow
            newBtnClone.innerHTML = 'New <span class="dropdown-arrow">▼</span>';
            // Replace the original button with our container
            (_a = this.newBtn.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(buttonContainer, this.newBtn);
            buttonContainer.appendChild(newBtnClone);
            (_b = this.newBtn.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(this.newBtn);
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
        }
        else if (!this.isSorting) {
            // Start new sorting
            this.isSorting = true;
            this.isPaused = false;
            this.startBtn.textContent = 'Pause';
            this.sortRunner();
        }
        else {
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
        switch (this.currentPlayfieldType) {
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
        if (typeof window.exports !== 'undefined') {
            try {
                delete window.exports;
            }
            catch (e) { /* ignore */ }
        }
    }
    /**
     * Swaps two bars in the visualization
     * @param i Index of first bar to swap
     * @param j Index of second bar to swap
     */
    swap(i, j) {
        return __awaiter(this, void 0, void 0, function* () {
            const bars = this.playfield.children;
            if (i < 0 || j < 0 || i >= bars.length || j >= bars.length)
                return;
            yield this.pause(3);
            // Mark bars as being swapped
            const barI = this.getBar(i);
            const barJ = this.getBar(j);
            if (!barI || !barJ)
                return;
            barI.className = 'bar swap';
            barJ.className = 'bar swap';
            // Don't need to swap the DOM elements, just swap the heights
            const tempHeight = barI.style.height;
            barI.style.height = barJ.style.height;
            barJ.style.height = tempHeight;
            yield this.pause(3);
            barI.className = 'bar';
            barJ.className = 'bar';
        });
    }
    /**
     * Moves a bar from one position to another
     * @param i Source index
     * @param j Destination index
     */
    move(i, j) {
        return __awaiter(this, void 0, void 0, function* () {
            const bars = this.playfield.children;
            if (i < 0 || j < 0 || i >= bars.length || j >= bars.length || i === j)
                return;
            const barToMove = bars[i];
            // Mark the bar being moved
            barToMove.className = 'bar swap';
            // Pause before removing
            yield this.pause(4);
            // Remove the bar at i
            this.playfield.removeChild(barToMove);
            // Insert at new position j
            if (j >= this.playfield.children.length) {
                this.playfield.appendChild(barToMove);
            }
            else {
                this.playfield.insertBefore(barToMove, this.playfield.children[j]);
            }
            // Pause after inserting
            yield this.pause(4);
            barToMove.className = 'bar';
        });
    }
    /**
     * Gets the bar element at the specified index
     * @param i Index of the bar to retrieve
     * @returns The HTMLElement of the bar or null if out of bounds
     */
    getBar(i) {
        const bars = this.playfield.children;
        if (i < 0 || i >= bars.length)
            return null;
        return bars[i];
    }
    /**
     * Gets the height value of a bar at the specified index
     * @param i Index of the bar
     * @returns The height value as a number or null if not available
     */
    get(i) {
        const bars = this.playfield.children;
        if (i < 0 || i >= bars.length)
            return null;
        const bar = this.getBar(i);
        if (!bar)
            return null;
        return parseInt(bar.style.height, 10);
    }
    /**
     * Compares the heights of two bars and visually highlights them
     * @param i Index of first bar
     * @param j Index of second bar
     * @returns -1 if i < j, 1 if i > j, 0 if equal, null if invalid indices
     */
    compare(i, j) {
        const bars = this.playfield.children;
        if (i < 0 || j < 0 || i >= bars.length || j >= bars.length)
            return 0;
        this.clearMarks();
        // Mark bars as being compared
        const barI = this.getBar(i);
        const barJ = this.getBar(j);
        if (barI)
            barI.className = 'bar compare';
        if (barJ)
            barJ.className = 'bar compare';
        const valI = this.get(i);
        const valJ = this.get(j);
        if (valI === null || valJ === null)
            return 0;
        if (valI < valJ)
            return -1;
        if (valI > valJ)
            return 1;
        return 0;
    }
    /**
     * Marks a bar as sorted (final position)
     * @param i Index of the bar to mark as sorted
     */
    markSorted(i) {
        const bar = this.getBar(i);
        if (bar) {
            bar.className = 'bar sorted';
        }
    }
    /**
     * Clears visual markings on bars
     * @param clearSorted Whether to also clear the 'sorted' status (default: false)
     */
    clearMarks(clearSorted = false) {
        const bars = this.playfield.children;
        for (let i = 0; i < bars.length; i++) {
            const bar = bars[i];
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
    pause() {
        return __awaiter(this, arguments, void 0, function* (ratio = 1) {
            if (!this.isSorting) {
                // If sorting has been stopped completely
                throw new Error('Sorting stopped');
            }
            if (this.isPaused) {
                // If paused, wait until unpaused
                return new Promise(resolve => {
                    const checkPaused = () => {
                        if (!this.isPaused) {
                            // No longer paused, continue
                            resolve();
                        }
                        else if (!this.isSorting) {
                            // Sorting stopped while paused
                            throw new Error('Sorting stopped');
                        }
                        else {
                            // Still paused, check again after a short delay
                            setTimeout(checkPaused, 100);
                        }
                    };
                    checkPaused();
                });
            }
            // Normal delay based on speed setting
            return new Promise(resolve => setTimeout(resolve, this.pauseDelay / ratio));
        });
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
    sortRunner() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get the number of elements to sort
                const n = this.playfield.children.length;
                // Run the insertion sort algorithm with the number of elements
                yield this.currentAlgorithm.func(n);
                // Sorting completed successfully
                this.isSorting = false;
                this.startBtn.textContent = 'Start';
            }
            catch (e) {
                // Sorting was stopped, do nothing
                console.log('Sorting interrupted');
            }
        });
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
    bubbleSort(n) {
        return __awaiter(this, void 0, void 0, function* () {
            let i = 0;
            let j = 0;
            for (i = 0; i < n - 1; i++) {
                for (j = 0; j < n - i - 1; j++) {
                    if (this.compare(j, j + 1) > 0) {
                        yield this.swap(j, j + 1);
                    }
                }
                // Mark the largest element as sorted after each pass
                this.markSorted(j);
            }
        });
    }
    /**
     * Implements the insertion sort algorithm with visualization
     * For each element, insert it into its correct position in the sorted part of the array
     * @param n The number of elements to sort
     */
    insertionSortSwap(n) {
        return __awaiter(this, void 0, void 0, function* () {
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
                        yield this.swap(j - 1, j);
                        j--;
                    }
                    else {
                        // Element is in correct position, stop
                        break;
                    }
                }
                // Mark the current element as sorted
                this.markSorted(i);
            }
        });
    }
    /**
     * Implements the insertion sort algorithm using move operations
     * For each element, insert it directly into its correct position in the sorted part of the array
     * @param n The number of elements to sort
     */
    insertionSortMove(n) {
        return __awaiter(this, void 0, void 0, function* () {
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
                    yield this.move(i, j);
                    // Mark sorted section
                    for (let k = 0; k <= i; k++) {
                        this.markSorted(k);
                    }
                }
                else {
                    // No move needed, just mark as sorted
                    this.markSorted(i);
                }
            }
        });
    }
    // Quicksort implementation
    quicksort(n) {
        return __awaiter(this, void 0, void 0, function* () {
            this.states = new Array(n).fill(0);
            yield this.quicksortHelper(0, n - 1);
            // Mark all elements as sorted when done
            this.states.fill(3);
            yield this.updatePlayfield();
        });
    }
    quicksortHelper(low, high) {
        return __awaiter(this, void 0, void 0, function* () {
            if (low < high && this.isSorting && !this.isPaused) {
                const pi = yield this.partition(low, high);
                yield this.quicksortHelper(low, pi - 1);
                yield this.quicksortHelper(pi + 1, high);
            }
        });
    }
    partition(low, high) {
        return __awaiter(this, void 0, void 0, function* () {
            const bars = this.playfield.children;
            const pivot = parseInt(bars[high].style.height);
            this.states[high] = 1; // Mark pivot
            yield this.updatePlayfield();
            let i = low - 1;
            for (let j = low; j < high; j++) {
                if (this.isPaused) {
                    yield this.waitForResume();
                }
                if (!this.isSorting)
                    return i + 1;
                this.states[j] = 2; // Mark current element being compared
                yield this.updatePlayfield();
                yield this.pause();
                const current = parseInt(bars[j].style.height);
                if (current < pivot) {
                    i++;
                    yield this.swap(i, j);
                }
                this.states[j] = 0; // Reset state
                yield this.updatePlayfield();
            }
            yield this.swap(i + 1, high);
            this.states[high] = 0; // Reset pivot state
            return i + 1;
        });
    }
    updatePlayfield() {
        return __awaiter(this, void 0, void 0, function* () {
            const bars = this.playfield.children;
            for (let i = 0; i < bars.length; i++) {
                const bar = bars[i];
                // Update colors based on states
                switch (this.states[i]) {
                    case 1: // Pivot
                        bar.style.backgroundColor = '#ff0000';
                        break;
                    case 2: // Being compared
                        bar.style.backgroundColor = '#ffa500';
                        break;
                    case 3: // Sorted
                        bar.style.backgroundColor = '#00ff00';
                        break;
                    default: // Normal
                        bar.style.backgroundColor = '#3498db';
                        break;
                }
            }
        });
    }
    waitForResume() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                const checkPaused = () => {
                    if (!this.isPaused) {
                        resolve();
                    }
                    else {
                        setTimeout(checkPaused, 100);
                    }
                };
                checkPaused();
            });
        });
    }
    /**
     * Implements the insertion sort algorithm with visualization
     * For each element, insert it into its correct position in the sorted part of the array
     * @param n The number of elements to sort
     */
    aleksInsertionSortVisualizer(n) {
        return __awaiter(this, void 0, void 0, function* () {
            // Mark the first element as sorted initially
            this.markSorted(0);
            // Process each element starting from the second one
            for (let i = 1; i < n; i++) {
                // Get the current element's value safely
                const key = this.get(i);
                if (key === null)
                    continue;
                // Start comparing with the previous element
                let j = i - 1;
                // Compare and swap elements until we find the right position
                while (j >= 0) {
                    const prevValue = this.get(j);
                    // Safely compare values (avoiding non-null assertions)
                    if (prevValue !== null && prevValue > key) {
                        // If previous element is greater, swap them
                        yield this.swap(j, j + 1);
                        j--;
                    }
                    else {
                        // Element is in correct position, stop
                        break;
                    }
                }
                // Mark current position as sorted
                this.markSorted(i);
            }
            // Ensure all elements are marked as sorted when complete
            for (let k = 0; k < n; k++) {
                this.markSorted(k);
            }
        });
    }
}
