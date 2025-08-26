import { message } from 'antd';
class ErrorMessageManager {
  private queue: string[];
  private timer: any;
  private delay: number;
  constructor() {
    this.queue = [];
    this.timer = null;
    this.delay = 200;
  }
  push(message: string) {
    this.queue.push(message);
    if (!this.timer) {
      this.timer = setTimeout(() => {
        this.showMessage();
      }, this.delay);
    }
  }
  showMessage() {
    if (this.queue.length === 0) return;
    const uniqueQueue = [...new Set(this.queue)];
    uniqueQueue.forEach((msg) => {
      message.error(msg);
    });
    this.queue = [];
    this.timer = null;
  }
}

export default ErrorMessageManager;
