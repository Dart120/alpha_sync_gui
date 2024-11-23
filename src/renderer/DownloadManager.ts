import { Job, ReadyJob,UPNPImage, DisplayUPNPImage  } from 'main/Types';
import Queue from './Queue';


function isReadyJob(item: ReadyJob | unknown): item is ReadyJob {
  return (<ReadyJob>item).filePath !== undefined;
}

export default class DownloadManager {
  jobQueue: Queue<ReadyJob> = new Queue<ReadyJob>();

  downloadStatus = {
    totalToDownload: 0,
    downloaded: 0,
  };

  constructor() {
    console.log('created');
    this.downloadStatus = {
      totalToDownload: 0,
      downloaded: 0,
    };
    window.electron.ipcRenderer.on('task-finished', (result) => {
      console.log('detected done');
      if (result) {
        console.log('removed job');
        this.jobQueue.dequeue();
        if (!this.jobQueue.isEmpty) {
          console.log('started another');
          this.execute(this.jobQueue.peek());
        } else {
          this.downloadStatus = {
            totalToDownload: 0,
            downloaded: 0,
          };
          console.log('All jobs finished');
        }
      } else {
        console.log('failure starting over');
        this.clear();
      }
    });
    // window.electron.ipcRenderer.on('image-downloaded', () => {
    //   console.log('image was just downloaded');
    //   this.downloadStatus.downloaded++;
    // });
    window.electron.ipcRenderer.on('got-file-path', (readyJob) => {
      if (isReadyJob(readyJob)) {
        const wasEmpty: boolean = this.jobQueue.isEmpty;
        console.log(`b4 adding job ${this.jobQueue.length.toString()}`);
        this.jobQueue.enqueue(readyJob);

        console.log("Before count**");
        console.log(this.downloadStatus);
        this.downloadStatus.totalToDownload += this.count_images(readyJob);
        console.log(`HOW MANY IMAGES DID YOU TICK, WAS IT ${this.downloadStatus.totalToDownload} MANY???`);

        // const item = readyJob['item'];


        console.log(`after adding job ${this.jobQueue.length.toString()}`);
        if (wasEmpty) {
          this.execute(this.jobQueue.peek());
        }
      }
    });
    // window.electron.ipcRenderer.on('cancelled', () => {
    //   console.info('queue cleared');
    //   this.clear();
    // });
  }

  // eslint-disable-next-line class-methods-use-this
  add(job: Job): void {
    window.electron.ipcRenderer.sendMessage('show-save-dialog', job);
  }

  clear(): void {
    this.jobQueue = new Queue<ReadyJob>();
  }

  // eslint-disable-next-line class-methods-use-this
  execute(job: ReadyJob): void {
    console.log(`exe ${job.message}`);
    window.electron.ipcRenderer.sendMessage(job.message, job);
  }

  count_images(job : ReadyJob): number {
    let count: number = 0;

    function isRecord(value: unknown): value is Record<string, unknown> {
      return typeof value === 'object' && value !== null;
    }

    console.log(isRecord(job['item']));

        if (isRecord(job['item'])) {
          // Use Object.entries to iterate over the Record
          Object.entries(job.item).forEach(([key, list]) => {

            // Use forEach to iterate over the array
        list.forEach(photo => {
          console.log(photo)
              if (photo.checked) {
                count++;
              }
            });
          });
        }
    return count
  }
}
