import { toast } from 'sonner';

interface IOption {
  delay?: number;
}
class ErrorMessageManager {
  private queue: string[];
  private timer: any;
  private delay: number;
  constructor(option?: IOption) {
    this.queue = [];
    this.timer = null;
    this.delay = option?.delay || 200;
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
      toast.error(msg, {
        position: 'top-center',
      });
    });
    this.queue = [];
    this.timer = null;
  }
  showWarningMessage() {
    if (this.queue.length === 0) return;
    const uniqueQueue = [...new Set(this.queue)];
    uniqueQueue.forEach((msg) => {
      toast.warning(msg, {
        position: 'top-center',
      });
    });
    this.queue = [];
    this.timer = null;
  }
}

export default ErrorMessageManager;
