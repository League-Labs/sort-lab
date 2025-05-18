"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortDemo = void 0;
class SortDemo {
    constructor() {
        this.barCount = 25;
        this.minHeight = 30;
        this.maxHeight = 320;
        this.playfield = document.getElementById('playfield');
        this.startBtn = document.getElementById('start-btn');
        this.stopBtn = document.getElementById('stop-btn');
        this.restartBtn = document.getElementById('restart-btn');
        this.newBtn = document.getElementById('new-btn');
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
exports.SortDemo = SortDemo;
