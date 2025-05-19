export class SortDemo {
  private playfield: HTMLElement;
  private startBtn: HTMLButtonElement;
  private stopBtn: HTMLButtonElement;
  private restartBtn: HTMLButtonElement;
  private newBtn: HTMLButtonElement;
  private speedSlider: HTMLInputElement;
  private speed: number = 100; // Default speed in ms
  private speedSlowest = 1000;
  private speedFastest = 10;
  private barCount = 25;
  private minHeight = 30;
  private maxHeight = 320;

  constructor() {
    this.playfield = document.getElementById('playfield')!;
    this.startBtn = document.getElementById('start-btn') as HTMLButtonElement;
    this.stopBtn = document.getElementById('stop-btn') as HTMLButtonElement;
    this.restartBtn = document.getElementById('restart-btn') as HTMLButtonElement;
    this.newBtn = document.getElementById('new-btn') as HTMLButtonElement;
    this.speedSlider = document.getElementById('speed-slider') as HTMLInputElement;

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
    if (typeof (window as any).exports !== 'undefined') {
      try { delete (window as any).exports; } catch (e) { /* ignore */ }
    }
  }

  swap(i: number, j: number) {
    const bars = this.playfield.children;
    if (i < 0 || j < 0 || i >= bars.length || j >= bars.length) return;
    
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
  }

  move(i: number, j: number) {
    const bars = this.playfield.children;
    if (i < 0 || j < 0 || i >= bars.length || j >= bars.length || i === j) return;
    const barToMove = bars[i];
    // Remove the bar at i
    this.playfield.removeChild(barToMove);
    // Insert at new position j
    if (j >= this.playfield.children.length) {
      this.playfield.appendChild(barToMove);
    } else {
      this.playfield.insertBefore(barToMove, this.playfield.children[j]);
    }
  }

  getBar(i: number): HTMLElement | null {
    const bars = this.playfield.children;
    if (i < 0 || i >= bars.length) return null;
    return bars[i] as HTMLElement;
  }

  get(i: number): number | null {
    const bars = this.playfield.children;
    if (i < 0 || i >= bars.length) return null;
    const bar = this.getBar(i)
    if (!bar) return null;
    return parseInt(bar.style.height, 10);
  }

  compare(i: number, j: number): number | null {
    const bars = this.playfield.children;
    if (i < 0 || j < 0 || i >= bars.length || j >= bars.length) return null;
    
    // Mark bars as being compared
    const barI = this.getBar(i);
    const barJ = this.getBar(j);
    if (barI) barI.className = 'bar compare';
    if (barJ) barJ.className = 'bar compare';
    
    const valI = this.get(i);
    const valJ = this.get(j);
    if (valI === null || valJ === null) return null;
    if (valI < valJ) return -1;
    if (valI > valJ) return 1;
    return 0;
  }

  markSorted(i: number) {
    const bar = this.getBar(i);
    if (bar) {
      bar.className = 'bar sorted';
    }
  }

  clearMarks(clearSorted: boolean = false) {
    const bars = this.playfield.children;
    for (let i = 0; i < bars.length; i++) {
      const bar = bars[i] as HTMLElement;
      if (clearSorted || !bar.className.includes('sorted')) {
        bar.className = bar.className.includes('sorted') && !clearSorted ? 'bar sorted' : 'bar';
      }
    }
  }

  async pause(ratio: number = 1) {
    return new Promise(resolve => setTimeout(resolve, this.speed/ratio));
  }

  async bubbleSort() {
    const n = this.playfield.children.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        this.clearMarks();
        const cmp = this.compare(j, j + 1);
        await this.pause(3);
        if (cmp !== null && cmp > 0) {
          this.swap(j, j + 1);
        }
        await this.pause(3);
      }
      // Mark the largest element as sorted after each pass
      this.markSorted(n - i - 1);
    }
    // Mark the first element as sorted (it will be the smallest)
    this.markSorted(0);
  }
}
