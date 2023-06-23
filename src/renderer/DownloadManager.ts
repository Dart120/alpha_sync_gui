import { Job } from 'main/Types';
import Queue from './Queue';

export default class DownloadManager {
  jobQueue: Queue<Job> = new Queue<Job>();

  finishedTask = window.electron.ipcRenderer.on('task-finished', (result) => {
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
      this.jobQueue = new Queue<Job>();
    }
  });

  add(job: Job): void {
    console.log(`adding job ${this.jobQueue.length.toString()}`);
    const wasEmpty: boolean = this.jobQueue.isEmpty;
    this.jobQueue.enqueue(job);
    if (wasEmpty) {
      this.execute(this.jobQueue.peek());
    }
  }

  execute(job: Job): void {
    console.log(`exe ${job.message}`);
    window.electron.ipcRenderer.sendMessage(job.message, job.item);
  }
}
