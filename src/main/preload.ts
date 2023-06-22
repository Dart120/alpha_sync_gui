// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import {
  contextBridge,
  ipcRenderer,
  IpcRendererEvent,
  dialog,
  SaveDialogOptions,
} from 'electron';
// import * as Electron from 'electron';
export type Channels =
  | 'ipc-example'
  | 'get-images'
  | 'recieved-images'
  | 'get-liveness'
  | 'recieved-liveness'
  | 'start-download';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
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
