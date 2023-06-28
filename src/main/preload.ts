// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
// import * as Electron from 'electron';
export type Channels =
  | 'trigger'
  | 'get-images'
  | 'recieved-images'
  | 'get-liveness'
  | 'recieved-liveness'
  | 'start-download'
  | 'download-checked-images'
  | 'task-finished'
  | 'task-finished-class'
  | 'show-save-dialog'
  | 'got-file-path';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
      const eventNames = ipcRenderer.eventNames();
      console.log('Event Listeners:');
      eventNames.forEach((eventName) => {
        const listeners = ipcRenderer.listeners(eventName);
        console.log(eventName, listeners);
      });
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => func(...args);
      ipcRenderer.on(channel, subscription);
      const eventNames = ipcRenderer.eventNames();
      console.log('Event Listeners:');
      eventNames.forEach((eventName) => {
        const listeners = ipcRenderer.listeners(eventName);
        console.log(eventName, listeners);
      });
      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
      const eventNames = ipcRenderer.eventNames();
      console.log('Event Listeners:');
      eventNames.forEach((eventName) => {
        const listeners = ipcRenderer.listeners(eventName);
        console.log(eventName, listeners);
      });
    },
    removeEventListener(channel: Channels) {
      ipcRenderer.removeAllListeners(channel);
      const eventNames = ipcRenderer.eventNames();
      console.log('Event Listeners:');
      eventNames.forEach((eventName) => {
        const listeners = ipcRenderer.listeners(eventName);
        console.log(eventName, listeners);
      });
    },
  },
  // dialog: {
  //   showSaveDialog(options: SaveDialogOptions) {
  //     dialog.showSaveDialog(options);
  //   },
  // },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
