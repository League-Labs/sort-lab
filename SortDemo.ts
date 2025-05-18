export class SortDemo {
  private playfield: HTMLElement;
  private startBtn: HTMLButtonElement;
  private stopBtn: HTMLButtonElement;
  private restartBtn: HTMLButtonElement;
  private newBtn: HTMLButtonElement;
  private barCount = 25;
  private minHeight = 30;
  private maxHeight = 320;

  constructor() {
    this.playfield = document.getElementById('playfield')!;
    this.startBtn = document.getElementById('start-btn') as HTMLButtonElement;
    this.stopBtn = document.getElementById('stop-btn') as HTMLButtonElement;
    this.restartBtn = document.getElementById('restart-btn') as HTMLButtonElement;
    this.newBtn = document.getElementById('new-btn') as HTMLButtonElement;

    this.newBtn.addEventListener('click', () => this.createNewPlayfield());
  }

  createNewPlayfield() {
    this.playfield.innerHTML = '';
    for (let i = 0; i < this.barCount; i++) {
      const bar = document.createElement('div');
      bar.className = 'bar';
      const height = Math.floor(Math.random() * (this.maxHeight - this.minHeight + 1)) + this.minHeight;
      bar.style.height = height + 'px';
      this.playfield.appendChild(bar);
    }
  }
}
