/**
 * Accurate Timer class that prevents drift using performance timestamps
 * Uses setInterval for background tab reliability
 */
class Timer {
  constructor(durationInSeconds, onTick, onComplete) {
    this.duration = durationInSeconds;
    this.remaining = durationInSeconds;
    this.onTick = onTick;
    this.onComplete = onComplete;
    this.isRunning = false;
    this.startTime = null;
    this.pausedTime = null;
    this.intervalId = null;
  }

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.startTime = Date.now() - (this.duration - this.remaining) * 1000;
    this.tick();
  }

  tick() {
    if (!this.isRunning) return;

    const elapsed = Date.now() - this.startTime;
    const remaining = Math.max(0, this.duration - Math.floor(elapsed / 1000));

    if (remaining !== this.remaining) {
      this.remaining = remaining;
      this.onTick(this.remaining);
    }

    if (remaining > 0) {
      // Use setInterval instead of requestAnimationFrame for background tab reliability
      // Check every 100ms for accuracy
      if (!this.intervalId) {
        this.intervalId = setInterval(() => this.tick(), 100);
      }
    } else {
      this.complete();
    }
  }

  pause() {
    if (!this.isRunning) return;

    this.isRunning = false;
    this.pausedTime = this.remaining;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  resume() {
    if (this.isRunning) return;
    this.start();
  }

  reset() {
    this.pause();
    this.remaining = this.duration;
    this.onTick(this.remaining);
  }

  complete() {
    this.pause();
    this.remaining = 0;
    this.onComplete();
  }

  setDuration(durationInSeconds) {
    const wasRunning = this.isRunning;
    this.pause();
    this.duration = durationInSeconds;
    this.remaining = durationInSeconds;
    this.onTick(this.remaining);

    if (wasRunning) {
      this.start();
    }
  }

  getRemaining() {
    return this.remaining;
  }

  getProgress() {
    return (this.duration - this.remaining) / this.duration;
  }
}
