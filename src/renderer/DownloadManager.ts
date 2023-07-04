import { Job, ReadyJob } from 'main/Types';
import Queue from './Queue';

function isReadyJob(item: ReadyJob | unknown): item is ReadyJob {
  return (<ReadyJob>item).filePath !== undefined;
}

export default class DownloadManager {
  jobQueue: Queue<ReadyJob> = new Queue<ReadyJob>();

  constructor() {
    console.log('created');
    window.electron.ipcRenderer.on('task-finished-class', (result) => {
      console.log('detected done');
      if (result) {
        console.log('removed job');
        this.jobQueue.dequeue();
        if (!this.jobQueue.isEmpty) {
          console.log('started another');
          this.execute(this.jobQueue.peek());
        }
      } else {
        console.log('failure starting over');
        this.jobQueue = new Queue<ReadyJob>();
      }
    });
    window.electron.ipcRenderer.on('got-file-path', (readyJob) => {
      if (isReadyJob(readyJob)) {
        const wasEmpty: boolean = this.jobQueue.isEmpty;
        console.log(`b4 adding job ${this.jobQueue.length.toString()}`);
        this.jobQueue.enqueue(readyJob);
        console.log(`after adding job ${this.jobQueue.length.toString()}`);
        if (wasEmpty) {
          this.execute(this.jobQueue.peek());
        }
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  add(job: Job): void {
    window.electron.ipcRenderer.sendMessage('show-save-dialog', job);
  }

  // eslint-disable-next-line class-methods-use-this
  execute(job: ReadyJob): void {
    console.log(`exe ${job.message}`);
    window.electron.ipcRenderer.sendMessage(job.message, job);
  }
}
