/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import {
  app, BrowserWindow, shell, ipcMain, dialog, IpcMainEvent,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import { installExtension, REACT_DEVELOPER_TOOLS } from 'electron-extension-installer';
import { AlphaSync } from 'alpha_sync';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import {
  UPNPImage, Job, ReadyJob,
} from './Types';

const as = new AlphaSync();

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

const getImages = async (): Promise<Record<string, UPNPImage[]>> => {
  try {
    await as.discover_avaliable_services();
    await as.generate_tree();
  } catch (error) {
    throw new Error(`Error retrieving images because ${error}`);
  }

  return as.date_to_items;
};
const ssdp = async () => {
  try {
    await as.ssdp();
  } catch (error) {
    throw new Error(`SSDP failed because: ${error}`);
  }
};
const refresh = async (event: IpcMainEvent) => {
  try {
    event.reply('refresh-started');
    const images: Record<string, UPNPImage[]> = await getImages();
    event.reply('recieved-images', images);
  } catch (error) {
    event.reply('recieved-images', false);
  }
};
ipcMain.on('ssdp-start', async (event) => {
  try {
    await ssdp();
    event.reply('ssdp-success');
    console.log('works');
    await refresh(event);
  } catch (error) {
    event.reply('ssdp-failed');
  }
});

ipcMain.on('get-images', async (event) => {
  // const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  await refresh(event);
});
function isImage(item: UPNPImage | Record<string, UPNPImage[]>): item is UPNPImage {
  return (<UPNPImage>item)['dc:title'] !== undefined;
}
ipcMain.on('show-save-dialog', (event, job: Job) => {
  dialog
    .showSaveDialog({
      title: 'Save File',
      defaultPath: './images',
    }).then((result) => {
      if (!result.canceled && result.filePath) {
      // Trigger the file download using the main process
        const readyJob: ReadyJob = { ...job, filePath: result.filePath };
        event.reply('got-file-path', readyJob);
        event.reply('length-likely-changed');
      }
    });
});
ipcMain.on('get-liveness', (event) => {
  // const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  const url = as.cameraUrl;
  fetch(`${url}/dd.xml`)
    .then((resp) => {
      event.reply('recieved-liveness', resp.status === 200);
    })
    .catch(() => {
      event.reply('recieved-liveness', false);
    });
});

ipcMain.on('cancel-all-jobs', (event) => {
  console.info('cancel request recieved');
  as.jobHasBeenCancelled = true;
  event.reply('cancelled');
});
// Below returns empty objects
ipcMain.on(
  'download-checked-images',
  async (event, job: ReadyJob) => {
    // const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
    mainWindow?.webContents.send('trigger');
    // console.log(record);
    if (!isImage(job.item)) {
      let displayDateImagesRecord = Object.fromEntries(
        Object.entries(job.item).map(([key, value]) => {
          const newValue = value.filter((image) => image.checked);
          return [key, newValue];
        }),
      );
      // console.log(displayDateImagesRecord);
      displayDateImagesRecord = Object.fromEntries(
        Object.entries(displayDateImagesRecord).filter(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ([_, value]) => value.length,
        ),
      );
      try {
        console.log('about to download');
        const result: boolean = await as.get_all_images_from_dict(
          job.filePath,
          displayDateImagesRecord,
        );

        // event.reply('task-finished-class', true);
        console.log(result);
        event.reply('task-finished', result);
      } catch (error) {
        // event.reply('task-finished-class', false);
        event.reply('task-finished', false);
      }
    }

    // console.log(displayDateImagesRecord);

    // Trigger the file download using the main process
  },
);

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

// app.whenReady().then(() => {
//   installExtension(REACT_DEVELOPER_TOOLS)
//     .then((name) => console.log(`Added Extension:  ${name}`))
//     .catch((err) => console.log('An error occurred: ', err));
// });

const createWindow = async () => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => path.join(RESOURCES_PATH, ...paths);

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    minWidth: 800,
    minHeight: 500,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(async () => {
    createWindow();
    await installExtension(REACT_DEVELOPER_TOOLS, {
      loadExtensionOptions: {
        allowFileAccess: true,
      },
    });
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
