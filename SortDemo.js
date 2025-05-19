var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class SortDemo {
    constructor() {
        this.speed = 100; // Default speed in ms
        this.speedSlowest = 1000;
        this.speedFastest = 10;
        this.barCount = 25;
        this.minHeight = 30;
        this.maxHeight = 320;
        this.playfield = document.getElementById('playfield');
        this.startBtn = document.getElementById('start-btn');
        this.stopBtn = document.getElementById('stop-btn');
        this.restartBtn = document.getElementById('restart-btn');
        this.newBtn = document.getElementById('new-btn');
        this.speedSlider = document.getElementById('speed-slider');
        this.newBtn.addEventListener('click', () => this.createNewPlayfield());
        this.startBtn.addEventListener('click', () => this.bubbleSort());
        // Set up speed slider
        if (this.speedSlider) {
            this.updateSpeedFromSlider();
            this.speedSlider.addEventListener('input', () => this.updateSpeedFromSlider());
        }
    }
    updateSpeedFromSlider() {
        // Convert slider value (10-500) to speed (2000ms to 50ms)
        // Invert the slider value (left = slow, right = fast)
        const sliderValue = parseInt(this.speedSlider.value);
        const sliderMin = parseInt(this.speedSlider.min);
        const sliderMax = parseInt(this.speedSlider.max);
        const normalizedValue = (sliderValue - sliderMin) / (sliderMax - sliderMin); // 0 to 1
        const invertedValue = 1 - normalizedValue; // 1 to 0
        this.speed = Math.floor(invertedValue * (this.speedSlowest - this.speedFastest) + this.speedFastest); // 2000ms to 50ms
    }
    createNewPlayfield() {
        // Remove all bars and generate new ones
        this.playfield.innerHTML = '';
        for (let i = 0; i < this.barCount; i++) {
            const bar = document.createElement('div');
            bar.className = 'bar';
            const height = Math.floor(Math.random() * (this.maxHeight - this.minHeight + 1)) + this.minHeight;
            bar.style.height = height + 'px';
            this.playfield.appendChild(bar);
        }
        // Remove any CommonJS exports from the global scope (browser only)
        if (typeof window.exports !== 'undefined') {
            try {
                delete window.exports;
            }
            catch (e) { /* ignore */ }
        }
    }
    swap(i, j) {
        const bars = this.playfield.children;
        if (i < 0 || j < 0 || i >= bars.length || j >= bars.length)
            return;
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
    }
    move(i, j) {
        const bars = this.playfield.children;
        if (i < 0 || j < 0 || i >= bars.length || j >= bars.length || i === j)
            return;
        const barToMove = bars[i];
        // Remove the bar at i
        this.playfield.removeChild(barToMove);
        // Insert at new position j
        if (j >= this.playfield.children.length) {
            this.playfield.appendChild(barToMove);
        }
        else {
            this.playfield.insertBefore(barToMove, this.playfield.children[j]);
        }
    }
    getBar(i) {
        const bars = this.playfield.children;
        if (i < 0 || i >= bars.length)
            return null;
        return bars[i];
    }
    get(i) {
        const bars = this.playfield.children;
        if (i < 0 || i >= bars.length)
            return null;
        const bar = this.getBar(i);
        if (!bar)
            return null;
        return parseInt(bar.style.height, 10);
    }
    compare(i, j) {
        const bars = this.playfield.children;
        if (i < 0 || j < 0 || i >= bars.length || j >= bars.length)
            return null;
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
            return null;
        if (valI < valJ)
            return -1;
        if (valI > valJ)
            return 1;
        return 0;
    }
    markSorted(i) {
        const bar = this.getBar(i);
        if (bar) {
            bar.className = 'bar sorted';
        }
    }
    clearMarks(clearSorted = false) {
        const bars = this.playfield.children;
        for (let i = 0; i < bars.length; i++) {
            const bar = bars[i];
            if (clearSorted || !bar.className.includes('sorted')) {
                bar.className = bar.className.includes('sorted') && !clearSorted ? 'bar sorted' : 'bar';
            }
        }
    }
    pause() {
        return __awaiter(this, arguments, void 0, function* (ratio = 1) {
            return new Promise(resolve => setTimeout(resolve, this.speed / ratio));
        });
    }
    bubbleSort() {
        return __awaiter(this, void 0, void 0, function* () {
            const n = this.playfield.children.length;
            for (let i = 0; i < n - 1; i++) {
                for (let j = 0; j < n - i - 1; j++) {
                    this.clearMarks();
                    const cmp = this.compare(j, j + 1);
                    yield this.pause(3);
                    if (cmp !== null && cmp > 0) {
                        this.swap(j, j + 1);
                    }
                    yield this.pause(3);
                }
                // Mark the largest element as sorted after each pass
                this.markSorted(n - i - 1);
            }
            // Mark the first element as sorted (it will be the smallest)
            this.markSorted(0);
        });
    }
}
