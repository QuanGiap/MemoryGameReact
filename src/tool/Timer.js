// Timer class to handle timing functionality using Date package
class Timer {
    constructor() {
        // Initialize timer properties
        this.startTime = null;
        this.elapsedTime = 0;
        this.running = false;
    }

    // Get the current elapsed time in seconds
    getTime() {
        if (this.running) {
            return Math.floor((Date.now() - this.startTime) / 1000);
        }
        return Math.floor(this.elapsedTime / 1000);
    }

    // Get the current elapsed time as a formatted string (MM:SS)
    getTimeString() {
        const totalSeconds = this.getTime();
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // Start the timer
    start() {
        if (!this.running) {
            this.startTime = Date.now() - this.elapsedTime;
            this.running = true;
        }
    }

    // Stop the timer
    stop() {
        if (this.running) {
            this.elapsedTime = Date.now() - this.startTime;
            this.running = false;
        }
    }

    // Reset the timer
    reset() {
        this.startTime = null;
        this.elapsedTime = 0;
        this.running = false;
    }

    // Set the timer to a specific time in seconds and start timer
    setTime(seconds) {
        this.reset();
        this.startTime = Date.now() - seconds * 1000;
        this.running = true;
    }
}

export default Timer;